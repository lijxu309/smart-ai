import * as admin from 'firebase-admin';

// Re-export admin functions
export * from './admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import OpenAI from 'openai';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
};

/**
 * Chat completion function
 * Handles AI chat requests and stores conversation history
 */
export const chatCompletion = onCall(
  { 
    cors: true,
    maxInstances: 10,
  },
  async (request) => {
    // Verify authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { messages, model = 'gpt-4', conversationId } = request.data;
    const userId = request.auth.uid;

    if (!messages || !Array.isArray(messages)) {
      throw new HttpsError('invalid-argument', 'Messages array is required');
    }

    try {
      const openai = getOpenAIClient();

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model,
        messages: messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
        max_tokens: 4096,
        temperature: 0.7,
      });

      const assistantMessage = completion.choices[0]?.message?.content || '';

      // Store conversation in Firestore
      if (conversationId) {
        const conversationRef = db
          .collection('users')
          .doc(userId)
          .collection('conversations')
          .doc(conversationId);

        await conversationRef.update({
          messages: admin.firestore.FieldValue.arrayUnion(
            { role: 'user', content: messages[messages.length - 1].content, timestamp: new Date() },
            { role: 'assistant', content: assistantMessage, timestamp: new Date() }
          ),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      return {
        success: true,
        message: assistantMessage,
        usage: completion.usage,
      };
    } catch (error) {
      console.error('Chat completion error:', error);
      throw new HttpsError('internal', 'Failed to generate response');
    }
  }
);

/**
 * Create new conversation
 */
export const createConversation = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { title = 'New Chat' } = request.data;
    const userId = request.auth.uid;

    try {
      const conversationRef = await db
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .add({
          title,
          messages: [],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        conversationId: conversationRef.id,
      };
    } catch (error) {
      console.error('Create conversation error:', error);
      throw new HttpsError('internal', 'Failed to create conversation');
    }
  }
);

/**
 * Image generation function
 */
export const generateImage = onCall(
  { 
    cors: true,
    maxInstances: 5,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = request.data;
    const userId = request.auth.uid;

    if (!prompt) {
      throw new HttpsError('invalid-argument', 'Prompt is required');
    }

    try {
      const openai = getOpenAIClient();

      // Check user's image generation quota
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const imageQuota = userData?.imageQuota || 10;
      const imagesGenerated = userData?.imagesGenerated || 0;

      if (imagesGenerated >= imageQuota) {
        throw new HttpsError('resource-exhausted', 'Image generation quota exceeded');
      }

      // Generate image
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: size as '1024x1024' | '1792x1024' | '1024x1792',
        quality: quality as 'standard' | 'hd',
        style: style as 'vivid' | 'natural',
      });

      const imageUrl = response.data?.[0]?.url;

      if (!imageUrl) {
        throw new HttpsError('internal', 'Failed to generate image');
      }

      // Store image in user's library
      await db
        .collection('users')
        .doc(userId)
        .collection('images')
        .add({
          prompt,
          url: imageUrl,
          size,
          quality,
          style,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // Update usage count
      await db.collection('users').doc(userId).update({
        imagesGenerated: admin.firestore.FieldValue.increment(1),
      });

      return {
        success: true,
        imageUrl,
        revisedPrompt: response.data?.[0]?.revised_prompt,
      };
    } catch (error) {
      console.error('Image generation error:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to generate image');
    }
  }
);

/**
 * Get user profile and subscription info
 */
export const getUserProfile = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const userId = request.auth.uid;

    try {
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        // Create default user profile
        const defaultProfile = {
          email: request.auth.token.email,
          displayName: request.auth.token.name || 'User',
          plan: 'free',
          messageQuota: 100,
          messagesUsed: 0,
          imageQuota: 10,
          imagesGenerated: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection('users').doc(userId).set(defaultProfile);

        return {
          success: true,
          profile: defaultProfile,
        };
      }

      return {
        success: true,
        profile: userDoc.data(),
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      throw new HttpsError('internal', 'Failed to get user profile');
    }
  }
);

/**
 * Update user settings
 */
export const updateUserSettings = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { settings } = request.data;
    const userId = request.auth.uid;

    if (!settings) {
      throw new HttpsError('invalid-argument', 'Settings object is required');
    }

    try {
      await db.collection('users').doc(userId).update({
        settings,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Update settings error:', error);
      throw new HttpsError('internal', 'Failed to update settings');
    }
  }
);

/**
 * Trigger on new user creation to initialize profile
 */
export const onUserCreated = onDocumentCreated(
  'users/{userId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const userData = snapshot.data();
    console.log('New user created:', event.params.userId, userData);

    // Additional initialization logic can be added here
    // e.g., send welcome email, create default folders, etc.
  }
);

/**
 * Text-to-speech function
 */
export const textToSpeech = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { text, voice = 'alloy', speed = 1.0 } = request.data;

    if (!text) {
      throw new HttpsError('invalid-argument', 'Text is required');
    }

    try {
      const openai = getOpenAIClient();

      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
        input: text,
        speed,
      });

      // Convert to base64
      const buffer = Buffer.from(await response.arrayBuffer());
      const base64Audio = buffer.toString('base64');

      return {
        success: true,
        audio: base64Audio,
        format: 'mp3',
      };
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new HttpsError('internal', 'Failed to generate speech');
    }
  }
);

/**
 * Speech-to-text function (transcription)
 */
export const speechToText = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { audioBase64, language = 'en' } = request.data;

    if (!audioBase64) {
      throw new HttpsError('invalid-argument', 'Audio data is required');
    }

    try {
      const openai = getOpenAIClient();

      // Convert base64 to buffer
      const buffer = Buffer.from(audioBase64, 'base64');
      
      // Create a File-like object
      const file = new File([buffer], 'audio.webm', { type: 'audio/webm' });

      const transcription = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language,
      });

      return {
        success: true,
        text: transcription.text,
      };
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw new HttpsError('internal', 'Failed to transcribe audio');
    }
  }
);
