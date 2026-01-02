# Smart AI 开发指南

## 项目概述

Smart AI 是一个基于 Vue 3 + Vite + Firebase 技术栈的 AI 聊天应用，克隆自 askaichat.app 的核心功能。

## 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - 类型安全的 JavaScript 超集
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Pinia** - Vue 状态管理库
- **Vue Router** - Vue 官方路由
- **VueFire** - Vue 的 Firebase 绑定

### 后端
- **Firebase Authentication** - 用户认证
- **Cloud Firestore** - NoSQL 数据库
- **Cloud Storage** - 文件存储
- **Cloud Functions** - 无服务器后端

### AI 集成
- **OpenAI API** - GPT-4, DALL-E 3, Whisper, TTS

## 项目结构

```
smart-ai/
├── src/                          # 前端源代码
│   ├── components/               # 可复用组件
│   │   └── chat/                 # 聊天相关组件
│   │       ├── ChatInput.vue     # 聊天输入框
│   │       ├── ChatMessage.vue   # 消息气泡
│   │       ├── ChatSidebar.vue   # 侧边栏
│   │       └── ModelSelector.vue # 模型选择器
│   ├── views/                    # 页面组件
│   │   ├── HomeView.vue          # 首页
│   │   ├── LoginView.vue         # 登录页
│   │   ├── RegisterView.vue      # 注册页
│   │   ├── ChatView.vue          # 聊天页
│   │   ├── ImageGeneratorView.vue# 图像生成页
│   │   ├── AssistantsView.vue    # AI 助手页
│   │   ├── SettingsView.vue      # 设置页
│   │   └── PricingView.vue       # 定价页
│   ├── stores/                   # Pinia 状态管理
│   │   ├── user.ts               # 用户状态
│   │   └── chat.ts               # 聊天状态
│   ├── services/                 # API 服务层
│   │   └── api.ts                # Firebase Functions 调用
│   ├── router/                   # 路由配置
│   │   └── index.ts
│   ├── types/                    # TypeScript 类型定义
│   │   └── index.ts
│   ├── firebase.ts               # Firebase 配置
│   ├── main.ts                   # 应用入口
│   └── style.css                 # 全局样式
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts              # 云函数入口
│   ├── package.json
│   └── tsconfig.json
├── firebase.json                 # Firebase 配置
├── firestore.rules               # Firestore 安全规则
├── firestore.indexes.json        # Firestore 索引
├── storage.rules                 # Storage 安全规则
├── .env.example                  # 环境变量模板
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
pnpm install

# 安装云函数依赖
cd functions && pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入 Firebase 配置：

```bash
cp .env.example .env
```

### 3. 配置 Firebase

1. 在 [Firebase Console](https://console.firebase.google.com/) 创建项目
2. 启用 Authentication (Email/Password, Google)
3. 创建 Firestore 数据库
4. 创建 Storage 存储桶
5. 将配置复制到 `.env` 文件

### 4. 配置 OpenAI API

在 Firebase Functions 中设置 OpenAI API Key：

```bash
firebase functions:secrets:set OPENAI_API_KEY
```

### 5. 启动开发服务器

```bash
# 启动前端开发服务器
pnpm dev

# 启动 Firebase 模拟器（可选）
firebase emulators:start
```

## 功能模块

### 1. 用户认证
- Email/密码登录注册
- Google 社交登录
- 会话持久化

### 2. AI 聊天
- 多模型支持 (GPT-4, GPT-3.5, Claude, Gemini)
- 流式响应
- 对话历史管理
- Markdown 渲染

### 3. 图像生成
- DALL-E 3 集成
- 多尺寸支持
- 图片库管理

### 4. AI 助手
- 预设助手角色
- 自定义助手创建

### 5. 语音功能
- 语音输入 (Whisper)
- 语音输出 (TTS)

### 6. 用户设置
- 主题切换
- 语言设置
- 默认模型
- 语音设置

## 部署

### 部署到 Firebase Hosting

```bash
# 构建前端
pnpm build

# 部署所有服务
firebase deploy

# 或分别部署
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## API 参考

### Cloud Functions

| 函数名 | 描述 |
|--------|------|
| `chatCompletion` | AI 聊天补全 |
| `createConversation` | 创建新对话 |
| `generateImage` | 生成图像 |
| `getUserProfile` | 获取用户资料 |
| `updateUserSettings` | 更新用户设置 |
| `textToSpeech` | 文字转语音 |
| `speechToText` | 语音转文字 |

## 安全考虑

- 所有 API 调用都需要用户认证
- Firestore 规则限制用户只能访问自己的数据
- Storage 规则限制文件大小和类型
- API Key 存储在 Firebase Secrets 中

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License
