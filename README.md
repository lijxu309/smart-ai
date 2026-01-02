# Smart AI

An advanced AI chatbot application built with Vue 3 + Vite + Firebase.

## Features

- 💬 **AI Chat** - Chat with multiple AI models (GPT-4, Claude, Gemini)
- 🎨 **Image Generation** - Create stunning images with AI
- 🤖 **AI Assistants** - Specialized assistants for various tasks
- 📝 **Document Analysis** - Upload and analyze documents
- 🔊 **Voice Chat** - Talk to AI using voice input
- 🌐 **Multi-language** - Support for multiple languages

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **AI Integration**: OpenAI API, Anthropic API, Google AI API

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lijxu309/smart-ai.git
   cd smart-ai
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Firebase configuration in `.env`

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
smart-ai/
├── src/
│   ├── components/       # Reusable Vue components
│   │   ├── chat/         # Chat-related components
│   │   ├── auth/         # Authentication components
│   │   ├── layout/       # Layout components
│   │   └── common/       # Common UI components
│   ├── views/            # Page components
│   ├── stores/           # Pinia stores
│   ├── router/           # Vue Router configuration
│   ├── types/            # TypeScript type definitions
│   ├── composables/      # Vue composables
│   ├── assets/           # Static assets
│   ├── firebase.ts       # Firebase configuration
│   ├── main.ts           # App entry point
│   └── App.vue           # Root component
├── public/               # Public static files
├── .env.example          # Environment variables template
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Create a Storage bucket
5. Copy your Firebase config to `.env`

## License

MIT License

## Author

Smart AI Team
