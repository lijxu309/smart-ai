import * as admin from 'firebase-admin';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';

// Re-export admin functions
export * from './admin';

// Define secrets
const deepseekApiKey = defineSecret('DEEPSEEK_API_KEY');
const openaiApiKey = defineSecret('OPENAI_API_KEY');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Model configuration mapping
const MODEL_CONFIG: Record<string, { provider: 'deepseek' | 'openai'; model: string }> = {
  'deepseek-chat': { provider: 'deepseek', model: 'deepseek-chat' },
  'deepseek-reasoner': { provider: 'deepseek', model: 'deepseek-reasoner' },
  'gpt-5-nano': { provider: 'deepseek', model: 'deepseek-chat' },
  'gpt-5.2-instant': { provider: 'deepseek', model: 'deepseek-chat' },
  'gemini-3-pro': { provider: 'deepseek', model: 'deepseek-chat' },
  'claude-4.5': { provider: 'deepseek', model: 'deepseek-chat' },
  'perplexity': { provider: 'deepseek', model: 'deepseek-chat' },
  'gpt-4': { provider: 'openai', model: 'gpt-4' },
  'gpt-4-turbo': { provider: 'openai', model: 'gpt-4-turbo' },
};

/**
 * Chat completion function with DeepSeek API support
 */
export const chatCompletion = onCall(
  { 
    cors: true,
    maxInstances: 10,
    secrets: [deepseekApiKey, openaiApiKey],
  },
  async (request) => {
    // Verify authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { messages, model = 'deepseek-chat', conversationId } = request.data;
    const userId = request.auth.uid;

    if (!messages || !Array.isArray(messages)) {
      throw new HttpsError('invalid-argument', 'Messages array is required');
    }

    try {
      const config = MODEL_CONFIG[model] || { provider: 'deepseek', model: 'deepseek-chat' };
      
      let apiKey: string;
      let baseUrl: string;
      let actualModel: string;

      if (config.provider === 'deepseek') {
        apiKey = deepseekApiKey.value();
        baseUrl = 'https://api.deepseek.com';
        actualModel = config.model;
      } else {
        apiKey = openaiApiKey.value();
        baseUrl = 'https://api.openai.com/v1';
        actualModel = config.model;
      }

      if (!apiKey) {
        throw new HttpsError('failed-precondition', 'API key not configured');
      }

      // Call AI API
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: actualModel,
          messages: messages.map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: 4096,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error:', errorData);
        throw new HttpsError('internal', 'AI API request failed');
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || '';

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

      // Update user message count
      await db.collection('users').doc(userId).update({
        messagesUsed: admin.firestore.FieldValue.increment(1),
      }).catch(() => {
        // Create user document if it doesn't exist
        db.collection('users').doc(userId).set({
          messagesUsed: 1,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      });

      return {
        success: true,
        message: assistantMessage,
        usage: data.usage,
      };
    } catch (error) {
      console.error('Chat completion error:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to generate response');
    }
  }
);

/**
 * Streaming chat completion endpoint (HTTP)
 */
export const chatCompletionStream = onRequest(
  {
    cors: true,
    maxInstances: 10,
    secrets: [deepseekApiKey],
  },
  async (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { messages, model = 'deepseek-chat', idToken } = req.body;

      // Verify Firebase ID token
      if (!idToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      try {
        await admin.auth().verifyIdToken(idToken);
      } catch {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Messages array is required' });
        return;
      }

      const config = MODEL_CONFIG[model] || { provider: 'deepseek', model: 'deepseek-chat' };
      const apiKey = deepseekApiKey.value();

      if (!apiKey) {
        res.status(500).json({ error: 'API key not configured' });
        return;
      }

      // Call DeepSeek API with streaming
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages,
          max_tokens: 4096,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        res.status(500).json({ error: 'AI API request failed' });
        return;
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        res.write(chunk);
      }

      res.end();
    } catch (error) {
      console.error('Streaming error:', error);
      res.status(500).json({ error: 'Internal server error' });
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
 * Image generation function with DeepSeek/OpenAI support
 */
export const generateImage = onCall(
  { 
    cors: true,
    maxInstances: 5,
    secrets: [openaiApiKey],
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
      const apiKey = openaiApiKey.value();
      
      if (!apiKey) {
        throw new HttpsError('failed-precondition', 'OpenAI API key not configured');
      }

      // Check user's image generation quota
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const imageQuota = userData?.imageQuota || 10;
      const imagesGenerated = userData?.imagesGenerated || 0;

      if (imagesGenerated >= imageQuota) {
        throw new HttpsError('resource-exhausted', 'Image generation quota exceeded');
      }

      // Generate image using OpenAI DALL-E
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size,
          quality,
          style,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Image generation error:', errorData);
        throw new HttpsError('internal', 'Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = data.data?.[0]?.url;

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
        revisedPrompt: data.data?.[0]?.revised_prompt,
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
          role: 'user',
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
  }
);

/**
 * Text-to-speech function using OpenAI TTS
 */
export const textToSpeech = onCall(
  { 
    cors: true,
    secrets: [openaiApiKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { text, voice = 'alloy', speed = 1.0 } = request.data;

    if (!text) {
      throw new HttpsError('invalid-argument', 'Text is required');
    }

    if (text.length > 4096) {
      throw new HttpsError('invalid-argument', 'Text is too long (max 4096 characters)');
    }

    try {
      const apiKey = openaiApiKey.value();
      
      if (!apiKey) {
        throw new HttpsError('failed-precondition', 'OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice,
          input: text,
          speed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('TTS error:', errorData);
        throw new HttpsError('internal', 'Failed to generate speech');
      }

      // Convert to base64
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');

      return {
        success: true,
        audio: base64Audio,
        format: 'mp3',
      };
    } catch (error) {
      console.error('Text-to-speech error:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to generate speech');
    }
  }
);

/**
 * Speech-to-text function using OpenAI Whisper
 */
export const speechToText = onCall(
  { 
    cors: true,
    secrets: [openaiApiKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { audioBase64, language = 'en', format = 'webm' } = request.data;

    if (!audioBase64) {
      throw new HttpsError('invalid-argument', 'Audio data is required');
    }

    try {
      const apiKey = openaiApiKey.value();
      
      if (!apiKey) {
        throw new HttpsError('failed-precondition', 'OpenAI API key not configured');
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(audioBase64, 'base64');
      
      // Create FormData for multipart upload
      const formData = new FormData();
      const blob = new Blob([buffer], { type: `audio/${format}` });
      formData.append('file', blob, `audio.${format}`);
      formData.append('model', 'whisper-1');
      formData.append('language', language);

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('STT error:', errorData);
        throw new HttpsError('internal', 'Failed to transcribe audio');
      }

      const data = await response.json();

      return {
        success: true,
        text: data.text,
      };
    } catch (error) {
      console.error('Speech-to-text error:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'Failed to transcribe audio');
    }
  }
);

/**
 * Get user's conversation history
 */
export const getConversations = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const userId = request.auth.uid;
    const { limit = 50 } = request.data || {};

    try {
      const conversationsRef = db
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .orderBy('updatedAt', 'desc')
        .limit(limit);

      const snapshot = await conversationsRef.get();
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        conversations,
      };
    } catch (error) {
      console.error('Get conversations error:', error);
      throw new HttpsError('internal', 'Failed to get conversations');
    }
  }
);

/**
 * Delete a conversation
 */
export const deleteConversation = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { conversationId } = request.data;
    const userId = request.auth.uid;

    if (!conversationId) {
      throw new HttpsError('invalid-argument', 'Conversation ID is required');
    }

    try {
      await db
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(conversationId)
        .delete();

      return { success: true };
    } catch (error) {
      console.error('Delete conversation error:', error);
      throw new HttpsError('internal', 'Failed to delete conversation');
    }
  }
);
