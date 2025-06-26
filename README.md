# JAM Digital Website

A modern, production-ready website and mobile app for JAM Digital built with cutting-edge technology and AI capabilities.

## 🚀 Tech Stack

### Web
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **AI**: Vercel AI SDK + Anthropic Claude + LangChain
- **Deployment**: Vercel

### Mobile
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Deployment**: Expo EAS

## 📁 Project Structure

```
jam-digital-website/
├── web/                    # Next.js web application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   └── ui/       # shadcn/ui components
│   │   └── lib/          # Utilities and shared code
│   ├── prisma/           # Database schema and migrations
│   └── public/           # Static assets
├── mobile/               # React Native mobile app
│   ├── app/             # Expo Router screens
│   ├── components/      # React Native components
│   └── assets/          # Mobile assets
└── shared/              # Shared types and utilities
```

## 🛠️ Setup

### Prerequisites
- Node.js 22+
- npm or pnpm
- Supabase account
- Anthropic API key
- Vercel account (for deployment)

### Environment Variables

Create `.env.local` in the `web` directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: Vercel KV for caching
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_read_only_token
```

### Installation

```bash
# Install dependencies for web
cd web
npm install

# Install dependencies for mobile
cd ../mobile
npm install
```

### Development

```bash
# Run web app
cd web
npm run dev

# Run mobile app
cd mobile
npm start
```

## 🤖 MCP Integration (AI-Powered Development)

This JAM Digital project includes a **Model Context Protocol (MCP) server** that gives AI assistants direct access to your development tools:

### 🚀 Quick MCP Setup
1. **Install Python 3.10+**: `brew install python@3.12`
2. **Run setup script**: `./setup-mcp.sh`
3. **Configure API keys**: Update `web/.env.local`
4. **Test everything**: `python3.12 test-mcp.py`

**📖 Detailed Instructions**: See `NEXT_STEPS.md`

### 🛠️ MCP Capabilities
- **Component Generation**: AI creates React/TypeScript components
- **Database Operations**: AI queries and modifies your Supabase database
- **Image Generation**: AI creates and processes images with DALL-E
- **Deployment**: AI deploys your app to Vercel
- **Full Stack Access**: AI understands your entire codebase

### 📁 MCP Files
- `web/backend/mcp-servers/unified-stack-server.py` - MCP server implementation
- `mcp-config.json` - MCP configuration
- `setup-mcp.sh` - Automated setup script
- `test-mcp.py` - Test suite
- `NEXT_STEPS.md` - Step-by-step setup guide

## 🚀 Features

### Web Features
- Server-side rendering with Next.js App Router
- Type-safe database queries with Prisma
- Beautiful UI components with shadcn/ui
- Real-time features with Supabase
- AI chat integration with streaming responses
- Responsive design with Tailwind CSS

### Mobile Features
- Cross-platform (iOS & Android)
- Expo managed workflow
- Share code with web through shared directory
- Native performance with React Native

### AI Capabilities
- Claude integration via Vercel AI SDK
- Streaming responses
- LangChain for complex AI workflows
- Function calling support

## 📚 Key Commands

### Web
```bash
# Add shadcn/ui component
npx shadcn@latest add [component-name]

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

### Mobile
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Build for production
eas build
```

## 🏗️ Deployment

### Web (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Mobile (Expo EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📖 Best Practices

1. **Code Sharing**: Use the `shared` directory for types and utilities used by both web and mobile
2. **Type Safety**: Leverage TypeScript throughout the stack
3. **Component Library**: Build reusable components in shadcn/ui style
4. **Database**: Use Prisma migrations for schema changes
5. **AI**: Implement proper error handling and rate limiting for AI features

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [LangChain Documentation](https://js.langchain.com/docs) 