#!/bin/bash

# Kill any existing Next.js processes
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Clear Next.js cache
echo "🗑️  Clearing cache..."
rm -rf .next

# Start development server
echo "🚀 Starting JAM Digital development server..."
echo "📱 Local: http://localhost:3000"
echo "🌐 Network: http://$(ipconfig getifaddr en0):3000"
echo ""

# Start with explicit host binding
HOST=0.0.0.0 npm run dev 