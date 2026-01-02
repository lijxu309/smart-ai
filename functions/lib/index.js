"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.speechToText = exports.textToSpeech = exports.onUserCreated = exports.updateUserSettings = exports.getUserProfile = exports.generateImage = exports.createConversation = exports.chatCompletion = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const openai_1 = __importDefault(require("openai"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// Initialize OpenAI client
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not configured');
    }
    return new openai_1.default({ apiKey });
};
/**
 * Chat completion function
 * Handles AI chat requests and stores conversation history
 */
exports.chatCompletion = (0, https_1.onCall)({
    cors: true,
    maxInstances: 10,
}, async (request) => {
    var _a, _b;
    // Verify authentication
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { messages, model = 'gpt-4', conversationId } = request.data;
    const userId = request.auth.uid;
    if (!messages || !Array.isArray(messages)) {
        throw new https_1.HttpsError('invalid-argument', 'Messages array is required');
    }
    try {
        const openai = getOpenAIClient();
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model,
            messages: messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
            max_tokens: 4096,
            temperature: 0.7,
        });
        const assistantMessage = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || '';
        // Store conversation in Firestore
        if (conversationId) {
            const conversationRef = db
                .collection('users')
                .doc(userId)
                .collection('conversations')
                .doc(conversationId);
            await conversationRef.update({
                messages: admin.firestore.FieldValue.arrayUnion({ role: 'user', content: messages[messages.length - 1].content, timestamp: new Date() }, { role: 'assistant', content: assistantMessage, timestamp: new Date() }),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        return {
            success: true,
            message: assistantMessage,
            usage: completion.usage,
        };
    }
    catch (error) {
        console.error('Chat completion error:', error);
        throw new https_1.HttpsError('internal', 'Failed to generate response');
    }
});
/**
 * Create new conversation
 */
exports.createConversation = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
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
    }
    catch (error) {
        console.error('Create conversation error:', error);
        throw new https_1.HttpsError('internal', 'Failed to create conversation');
    }
});
/**
 * Image generation function
 */
exports.generateImage = (0, https_1.onCall)({
    cors: true,
    maxInstances: 5,
}, async (request) => {
    var _a, _b, _c, _d;
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = request.data;
    const userId = request.auth.uid;
    if (!prompt) {
        throw new https_1.HttpsError('invalid-argument', 'Prompt is required');
    }
    try {
        const openai = getOpenAIClient();
        // Check user's image generation quota
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const imageQuota = (userData === null || userData === void 0 ? void 0 : userData.imageQuota) || 10;
        const imagesGenerated = (userData === null || userData === void 0 ? void 0 : userData.imagesGenerated) || 0;
        if (imagesGenerated >= imageQuota) {
            throw new https_1.HttpsError('resource-exhausted', 'Image generation quota exceeded');
        }
        // Generate image
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: size,
            quality: quality,
            style: style,
        });
        const imageUrl = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url;
        if (!imageUrl) {
            throw new https_1.HttpsError('internal', 'Failed to generate image');
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
            revisedPrompt: (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.revised_prompt,
        };
    }
    catch (error) {
        console.error('Image generation error:', error);
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError('internal', 'Failed to generate image');
    }
});
/**
 * Get user profile and subscription info
 */
exports.getUserProfile = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
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
    }
    catch (error) {
        console.error('Get user profile error:', error);
        throw new https_1.HttpsError('internal', 'Failed to get user profile');
    }
});
/**
 * Update user settings
 */
exports.updateUserSettings = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { settings } = request.data;
    const userId = request.auth.uid;
    if (!settings) {
        throw new https_1.HttpsError('invalid-argument', 'Settings object is required');
    }
    try {
        await db.collection('users').doc(userId).update({
            settings,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Update settings error:', error);
        throw new https_1.HttpsError('internal', 'Failed to update settings');
    }
});
/**
 * Trigger on new user creation to initialize profile
 */
exports.onUserCreated = (0, firestore_1.onDocumentCreated)('users/{userId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log('No data associated with the event');
        return;
    }
    const userData = snapshot.data();
    console.log('New user created:', event.params.userId, userData);
    // Additional initialization logic can be added here
    // e.g., send welcome email, create default folders, etc.
});
/**
 * Text-to-speech function
 */
exports.textToSpeech = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { text, voice = 'alloy', speed = 1.0 } = request.data;
    if (!text) {
        throw new https_1.HttpsError('invalid-argument', 'Text is required');
    }
    try {
        const openai = getOpenAIClient();
        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
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
    }
    catch (error) {
        console.error('Text-to-speech error:', error);
        throw new https_1.HttpsError('internal', 'Failed to generate speech');
    }
});
/**
 * Speech-to-text function (transcription)
 */
exports.speechToText = (0, https_1.onCall)({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const { audioBase64, language = 'en' } = request.data;
    if (!audioBase64) {
        throw new https_1.HttpsError('invalid-argument', 'Audio data is required');
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
    }
    catch (error) {
        console.error('Speech-to-text error:', error);
        throw new https_1.HttpsError('internal', 'Failed to transcribe audio');
    }
});
//# sourceMappingURL=index.js.map