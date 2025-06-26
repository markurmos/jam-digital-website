# JAM Digital - Quick Commands Reference

## 🟢 Server is Currently Running!
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.125:3000
- **Status**: ✅ Working with video converter

## 🚀 Start Server (Copy & Paste)

```bash
# Quick start from anywhere
/Users/markurmos/Projects/jam-digital-start.sh
```

```bash
# Manual start (must be in correct directory)
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web" && npm run dev
```

## 🛑 Stop Server

```bash
# Kill Next.js server
pkill -f "next"
```

## 🔄 Restart Server

```bash
# One-line restart command
pkill -f "next" && cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web" && rm -rf .next && npm run dev
```

## 📂 Navigate to Project

```bash
# Go to project root
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website"

# Go to web directory (where you run npm commands)
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web"
```

## 🔧 Common Fixes

```bash
# Fix: "npm error Missing script: dev"
# You're in wrong directory! Run this:
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web"

# Fix: Port already in use
lsof -ti:3000 | xargs kill -9

# Fix: Clear all caches and restart
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web" && rm -rf .next node_modules && npm install && npm run dev
```

## 📋 VS Code Commands

```bash
# Open project in VS Code
code "/Users/markurmos/Projects/JAM Digital/jam-digital-website"

# Open just the web folder
code "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web"
```

## 🎯 Test Endpoints

```bash
# Test homepage
curl http://localhost:3000

# Test image converter page
curl http://localhost:3000/image-converter

# Test video converter API
curl -X POST http://localhost:3000/api/video-converter
```

## ⚡ Production Commands

```bash
# Build for production
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web" && npm run build

# Start production server
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web" && npm start
```

## 🚨 Emergency Reset

```bash
# Complete reset (nuclear option)
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website/web" && \
pkill -f "next" && \
rm -rf .next node_modules package-lock.json && \
npm install && \
npm run dev
```

---

**Pro Tip**: Save this file in your code editor for quick access. The startup script `/Users/markurmos/Projects/jam-digital-start.sh` handles everything automatically! 