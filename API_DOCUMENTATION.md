# Smart AI - API Documentation

This document provides a detailed specification for the backend API of the Smart AI application, built on Firebase Cloud Functions.

## Base Information

All APIs are implemented as **Callable Functions** in Firebase. Clients should use the Firebase Functions SDK to call these endpoints.

- **Authentication**: All functions require a valid Firebase Authentication ID token to be passed in the request header. The server automatically verifies this token. Functions requiring admin privileges will perform an additional role check.
- **Error Handling**: Errors are returned using `HttpsError` from the Firebase Functions library. Clients should handle these standard error codes.

---

## 1. User-Facing APIs

These functions are intended to be called by regular authenticated users.

### 1.1 `chatCompletion`

Handles an AI chat request and streams the response.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `messages` | `Array<Object>` | Yes | An array of message objects (`{ role: string, content: string }`). |
| `model` | `string` | No | The AI model to use (e.g., `gpt-4`). Defaults to `gpt-4`. |
| `conversationId` | `string` | Yes | The ID of the conversation to which this message belongs. |

- **Success Response**:

```json
{
  "success": true,
  "message": "This is the AI-generated response.",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 150,
    "total_tokens": 200
  }
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `invalid-argument` | `messages` array is required. |
| `internal` | Failed to generate response. |

### 1.2 `createConversation`

Creates a new, empty conversation for the user.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | No | The initial title for the conversation. Defaults to "New Chat". |

- **Success Response**:

```json
{
  "success": true,
  "conversationId": "aBcDeFgHiJkLmNoPqRsT"
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `internal` | Failed to create conversation. |

### 1.3 `generateImage`

Generates an image based on a text prompt.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `prompt` | `string` | Yes | The text prompt for image generation. |
| `size` | `string` | No | Image size (`1024x1024`, `1792x1024`, `1024x1792`). Defaults to `1024x1024`. |
| `quality` | `string` | No | Image quality (`standard`, `hd`). Defaults to `standard`. |
| `style` | `string` | No | Image style (`vivid`, `natural`). Defaults to `vivid`. |

- **Success Response**:

```json
{
  "success": true,
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "revisedPrompt": "A photorealistic image of a cat sitting on a couch."
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `invalid-argument` | `prompt` is required. |
| `resource-exhausted` | Image generation quota exceeded. |
| `internal` | Failed to generate image. |

### 1.4 `getUserProfile`

Retrieves the profile and subscription information for the currently authenticated user.

- **Request Payload**: None

- **Success Response**:

```json
{
  "success": true,
  "profile": {
    "email": "user@example.com",
    "displayName": "John Doe",
    "plan": "pro",
    "messageQuota": 5000,
    "messagesUsed": 1234,
    "imageQuota": 100,
    "imagesGenerated": 42,
    "createdAt": "2025-12-01T10:00:00Z"
  }
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `internal` | Failed to get user profile. |

### 1.5 `updateUserSettings`

Updates the settings for the currently authenticated user.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings` | `Object` | Yes | An object containing the user settings to update (e.g., `{ "theme": "dark", "defaultModel": "gpt-4" }`). |

- **Success Response**:

```json
{
  "success": true
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `invalid-argument` | `settings` object is required. |
| `internal` | Failed to update settings. |

### 1.6 `textToSpeech`

Converts text into spoken audio.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | The text to convert to speech. |
| `voice` | `string` | No | The voice to use (`alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`). Defaults to `alloy`. |
| `speed` | `number` | No | The speech speed (0.25 to 4.0). Defaults to `1.0`. |

- **Success Response**:

```json
{
  "success": true,
  "audio": "...base64 encoded audio data...",
  "format": "mp3"
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `invalid-argument` | `text` is required. |
| `internal` | Failed to generate speech. |

### 1.7 `speechToText`

Transcribes spoken audio into text.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `audioBase64` | `string` | Yes | Base64 encoded audio data. |
| `language` | `string` | No | The language of the audio (ISO 639-1 format). Defaults to `en`. |

- **Success Response**:

```json
{
  "success": true,
  "text": "This is the transcribed text from the audio."
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `invalid-argument` | `audioBase64` data is required. |
| `internal` | Failed to transcribe audio. |

---

## 2. Admin-Facing APIs

These functions require the authenticated user to have an `admin` role.

### 2.1 `getDashboardStats`

Retrieves statistics for the admin dashboard.

- **Request Payload**: None

- **Success Response**:

```json
{
  "success": true,
  "stats": {
    "totalUsers": 1500,
    "activeUsers": 850,
    "proUsers": 250,
    "businessUsers": 50,
    "monthlyRevenue": 6248.50,
    "dailySignups": [
      { "date": "2026-01-03T...", "count": 15 },
      { "date": "2026-01-02T...", "count": 12 }
    ]
  }
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `internal` | Failed to get dashboard stats. |

### 2.2 `getUsers`

Retrieves a paginated list of all users.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | `number` | No | Number of users to fetch. Defaults to 20. |
| `startAfter` | `string` | No | The document ID of the last user from the previous page to fetch the next set. |
| `filter` | `Object` | No | An object to filter users by (e.g., `{ "plan": "pro", "status": "active" }`). |

- **Success Response**:

```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "plan": "pro",
      "status": "active",
      "createdAt": "..."
    }
  ],
  "hasMore": true
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `internal` | Failed to get users. |

### 2.3 `updateUser`

Updates a specific user's profile information.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | Yes | The ID of the user to update. |
| `updates` | `Object` | Yes | An object with the fields to update (e.g., `plan`, `status`, `role`). |

- **Success Response**: `{"success": true}`

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `invalid-argument` | `userId` and `updates` are required. |
| `internal` | Failed to update user. |

### 2.4 `deleteUser`

Deletes a user from Firebase Auth and Firestore.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | Yes | The ID of the user to delete. |

- **Success Response**: `{"success": true}`

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `invalid-argument` | `userId` is required. |
| `internal` | Failed to delete user. |

### 2.5 `getSubscriptions`

Retrieves a paginated list of all subscriptions.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | `number` | No | Number of subscriptions to fetch. Defaults to 20. |
| `startAfter` | `string` | No | The document ID of the last subscription for pagination. |
| `status` | `string` | No | Filter by status (`active`, `cancelled`, `past_due`). |

- **Success Response**:

```json
{
  "success": true,
  "subscriptions": [
    {
      "id": "sub_123",
      "userId": "user_abc",
      "userEmail": "user@example.com",
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "..."
    }
  ],
  "hasMore": true
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `internal` | Failed to get subscriptions. |

### 2.6 `cancelSubscription`

Cancels a user's active subscription.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subscriptionId` | `string` | Yes | The ID of the subscription to cancel. |
| `reason` | `string` | No | The reason for cancellation. |

- **Success Response**: `{"success": true}`

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `invalid-argument` | `subscriptionId` is required. |
| `not-found` | Subscription not found. |
| `internal` | Failed to cancel subscription. |

### 2.7 `saveAssistant`

Creates a new AI assistant or updates an existing one.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `assistantId` | `string` | No | The ID of the assistant to update. If omitted, a new one is created. |
| `data` | `Object` | Yes | An object containing the assistant's data (`name`, `description`, `systemPrompt`, etc.). |

- **Success Response**: `{"success": true}`

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `invalid-argument` | Assistant `name` and `systemPrompt` are required. |
| `internal` | Failed to save assistant. |

### 2.8 `deleteAssistant`

Deletes an AI assistant.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `assistantId` | `string` | Yes | The ID of the assistant to delete. |

- **Success Response**: `{"success": true}`

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `invalid-argument` | `assistantId` is required. |
| `internal` | Failed to delete assistant. |

### 2.9 `getSystemLogs`

Retrieves system logs.

- **Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | `number` | No | Number of logs to fetch. Defaults to 100. |
| `level` | `string` | No | Filter by log level (`info`, `warning`, `error`). |
| `service` | `string` | No | Filter by service name (`auth`, `api`, `payment`). |

- **Success Response**:

```json
{
  "success": true,
  "logs": [
    {
      "id": "log_123",
      "timestamp": "...",
      "level": "error",
      "service": "api",
      "message": "OpenAI API rate limit exceeded."
    }
  ]
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `internal` | Failed to get system logs. |

### 2.10 `getSystemSettings` / `updateSystemSettings`

Gets or updates global system settings.

- **`getSystemSettings` Request Payload**: None
- **`updateSystemSettings` Request Payload**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `settings` | `Object` | Yes | An object containing the settings to update. |

- **Success Response**:

```json
// For getSystemSettings
{
  "success": true,
  "settings": {
    "siteName": "Smart AI",
    "maintenanceMode": false,
    "openaiApiKey": "sk-••••"
  }
}

// For updateSystemSettings
{
  "success": true
}
```

- **Error Responses**:

| Code | Message |
|---|---|
| `unauthenticated` | User must be authenticated. |
| `permission-denied` | Admin access required. |
| `invalid-argument` | (`updateSystemSettings` only) `settings` object is required. |
| `internal` | Failed to get/update system settings. |
