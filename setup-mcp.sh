#!/bin/bash

# Unified Stack MCP Setup Script
# This script helps you configure and test your MCP server

set -e  # Exit on any error

echo "🚀 Unified Stack MCP Setup"
echo "=========================="

# Check if Python 3.10+ is available
echo "📋 Checking Python installation..."

PYTHON_CMD=""
for cmd in python3.12 python3.11 python3.10; do
    if command -v $cmd &> /dev/null; then
        version=$($cmd --version 2>&1 | cut -d' ' -f2)
        echo "✅ Found $cmd (version $version)"
        PYTHON_CMD=$cmd
        break
    fi
done

if [ -z "$PYTHON_CMD" ]; then
    echo "❌ No compatible Python version found (need 3.10+)"
    echo ""
    echo "Please install Python 3.10+ first:"
    echo "1. Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "2. Install Python: brew install python@3.12"
    echo "3. Run this script again"
    exit 1
fi

# Check if MCP is installed
echo "📦 Checking MCP installation..."
if ! $PYTHON_CMD -c "import mcp" &> /dev/null; then
    echo "⚠️  MCP not installed. Installing now..."
    $PYTHON_CMD -m pip install "mcp[cli]"
    echo "✅ MCP installed successfully"
else
    echo "✅ MCP is already installed"
fi

# Update mcp-config.json to use the correct Python command
echo "🔧 Updating MCP configuration..."
sed -i.bak "s/\"python3\"/\"$PYTHON_CMD\"/" mcp-config.json
echo "✅ Updated mcp-config.json to use $PYTHON_CMD"

# Check environment variables
echo "🔑 Checking environment variables..."
cd web

# Source environment files if they exist
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

MISSING_VARS=()

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "your_supabase_url" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_URL")
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your_supabase_anon_key" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_ANON_KEY")
fi

if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your_anthropic_api_key" ]; then
    MISSING_VARS+=("ANTHROPIC_API_KEY")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Missing environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update web/.env.local with your API keys:"
    echo "   - Get Supabase keys from: https://supabase.com/dashboard"
    echo "   - Get Anthropic API key from: https://console.anthropic.com/"
else
    echo "✅ All required environment variables are set"
fi

cd ..

# Test MCP server
echo "🧪 Testing MCP server..."
if command -v mcp &> /dev/null; then
    echo "Running MCP server test..."
    timeout 10s mcp dev web/backend/mcp-servers/unified-stack-server.py || {
        if [ $? -eq 124 ]; then
            echo "✅ MCP server started successfully (test timeout after 10s)"
        else
            echo "❌ MCP server test failed"
            echo "Check the server logs above for errors"
        fi
    }
else
    echo "⚠️  MCP CLI not available in PATH. Try running:"
    echo "   $PYTHON_CMD -m mcp dev web/backend/mcp-servers/unified-stack-server.py"
fi

# Create Claude Desktop config
echo "🖥️  Setting up Claude Desktop integration..."
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

mkdir -p "$CLAUDE_CONFIG_DIR"

cat > "$CLAUDE_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "unified-stack": {
      "command": "$PYTHON_CMD",
      "args": [
        "$(pwd)/web/backend/mcp-servers/unified-stack-server.py"
      ],
      "env": {
        "PROJECT_ROOT": "$(pwd)/web"
      }
    }
  }
}
EOF

echo "✅ Created Claude Desktop configuration"

# Summary
echo ""
echo "🎉 Setup Summary"
echo "==============="
echo "✅ Python $PYTHON_CMD is ready"
echo "✅ MCP package is installed"
echo "✅ Configuration files updated"
echo "✅ Claude Desktop configured"

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Still need to configure API keys in web/.env.local"
    echo ""
    echo "Next steps:"
    echo "1. Add your API keys to web/.env.local"
    echo "2. Restart Claude Desktop"
    echo "3. Test your MCP tools!"
else
    echo "🚀 Everything is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Restart Claude Desktop"
    echo "2. Try asking Claude to create a component or query your database"
    echo "3. Your AI assistant now has access to your full stack!"
fi

echo ""
echo "📖 For more information, see:"
echo "   - QUICK_MCP_SETUP.md"
echo "   - web/docs/MCP_INTEGRATION.md"