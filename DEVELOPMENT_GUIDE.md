# JAM Digital Website - Development Guide

## 🚀 Quick Start

Your server is now running successfully at: **http://localhost:3000**

### Essential Commands

```bash
# Always run from the correct directory
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web"

# Start the development server
npm run dev

# Or use the startup script from anywhere
/Users/markurmos/Projects/jam-digital-start.sh
```

## 📁 Project Structure

```
/Users/markurmos/Projects/JAM Digital/jam-digital-website/
├── web/                    # Main Next.js application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── page.tsx   # Homepage with video converter tab
│   │   │   └── image-converter/
│   │   │       └── page.tsx  # Combined image & video converter
│   │   ├── components/
│   │   │   ├── video-converter.tsx  # Video converter component
│   │   │   └── image-converter.tsx  # Image converter component
│   │   └── app/api/
│   │       ├── video-converter/route.ts  # Video conversion API
│   │       └── image-converter/route.ts  # Image conversion API
│   ├── package.json
│   └── next.config.ts
└── jam-digital-start.sh    # Startup script
```

## 🌐 Available URLs

- **Homepage**: http://localhost:3000
- **Media Converter Page**: http://localhost:3000/image-converter
  - Image converter (top section)
  - Video converter (bottom section)

## 💻 Development Workflow

### 1. Starting Development

```bash
# Method 1: Direct command (must be in correct directory)
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web"
npm run dev

# Method 2: Use startup script (works from anywhere)
/Users/markurmos/Projects/jam-digital-start.sh
```

### 2. Making Changes

The server has hot-reload enabled. Simply save your files and the changes will appear automatically.

### 3. Common Tasks

```bash
# Build for production
npm run build

# Run production server
npm start

# Run linting
npm run lint

# Clear cache and restart
rm -rf .next && npm run dev
```

## 🔧 Troubleshooting

### Server Not Starting?

1. **Wrong Directory**: Most common issue! Always ensure you're in:
   ```bash
   cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web"
   ```

2. **Port Already in Use**:
   ```bash
   # Kill any existing Next.js processes
   pkill -f "next"
   
   # Or find and kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

3. **Use the Startup Script**:
   ```bash
   /Users/markurmos/Projects/jam-digital-start.sh
   ```

## 🎬 Features Available

### Video Converter
- **Formats**: MP4, MOV → WebM, GIF, MP4, MOV
- **Quality**: Low (480p), Medium (720p), High (1080p)
- **Max Size**: 100MB
- **API Endpoint**: `/api/video-converter`

### Image Converter
- **Formats**: JPEG, PNG, WebP, GIF
- **AI Generation**: DALL-E integration
- **Cloud Storage**: Supabase integration
- **API Endpoint**: `/api/image-converter`

## 📝 Environment Variables

Located in `/web/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

## 🚀 Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## 📱 Testing on Other Devices

Your server is accessible on your local network at:
**http://192.168.1.125:3000**

## 🛠️ VS Code Integration

For the best development experience:

1. Open the project in VS Code:
   ```bash
   code "/Users/markurmos/Projects/JAM Digital/jam-digital-website"
   ```

2. Install recommended extensions:
   - Next.js Language Features
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier

3. Use the integrated terminal (Terminal → New Terminal) and run:
   ```bash
   cd web
   npm run dev
   ```

---

**Remember**: The most common issue is running commands from the wrong directory. When in doubt, use the startup script: `/Users/markurmos/Projects/jam-digital-start.sh` 