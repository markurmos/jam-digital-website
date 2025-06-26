#!/bin/bash

echo "🚀 Starting JAM Digital Development Server"
echo "========================================="

# Kill any existing Next.js processes
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait for port to be free
sleep 2

# Clear cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next

# Check environment
echo "📋 Environment check:"
echo "- Node: $(node -v)"
echo "- npm: $(npm -v)"
echo "- Directory: $(pwd)"

# Start the server
echo ""
echo "🌐 Starting server on http://localhost:3000"
echo "Please wait for compilation to complete..."
echo ""

# Start with explicit environment variables
export NODE_ENV=development
export PORT=3000

# Run the dev server
exec npm run dev 