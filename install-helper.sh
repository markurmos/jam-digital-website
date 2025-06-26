#!/bin/bash

# MCP Installation Helper
# This script helps you install Python 3.10+ and MCP

echo "🚀 MCP Installation Helper"
echo "========================="
echo ""
echo "I'll guide you through the installation process!"
echo ""

# Check if running in Terminal
if [ -z "$TERM" ]; then
    echo "❌ This script must be run in Terminal.app"
    echo "   Please open Terminal and run: ./install-helper.sh"
    exit 1
fi

# Function to wait for user
wait_for_user() {
    echo ""
    echo "Press Enter to continue..."
    read
}

# Step 1: Check current Python
echo "📋 Step 1: Checking current Python version"
echo "Current Python: $(python3 --version)"
echo ""

# Step 2: Install Homebrew
echo "📦 Step 2: Install Homebrew"
echo ""
if command -v brew &> /dev/null; then
    echo "✅ Homebrew is already installed!"
else
    echo "Homebrew is not installed. To install it:"
    echo ""
    echo "1. Copy this command:"
    echo ""
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""
    echo "2. Paste it in Terminal and press Enter"
    echo "3. Follow the prompts (you'll need your password)"
    echo "4. After installation, follow the instructions to add Homebrew to your PATH"
    echo ""
    echo "Then run this script again!"
    exit 0
fi

# Step 3: Install Python 3.12
echo "🐍 Step 3: Install Python 3.12"
echo ""
if command -v python3.12 &> /dev/null; then
    echo "✅ Python 3.12 is already installed!"
else
    echo "Installing Python 3.12 with Homebrew..."
    echo ""
    echo "Run this command:"
    echo "brew install python@3.12"
    echo ""
    wait_for_user
    
    # Try to install
    brew install python@3.12
    
    if [ $? -ne 0 ]; then
        echo "❌ Installation failed. Please try manually."
        exit 1
    fi
fi

# Step 4: Install MCP
echo ""
echo "📦 Step 4: Install MCP Package"
echo ""

# Find Python 3.12
PYTHON_CMD=$(which python3.12 || echo "")
if [ -z "$PYTHON_CMD" ]; then
    echo "❌ Python 3.12 not found in PATH"
    echo "Try: /opt/homebrew/bin/python3.12"
    PYTHON_CMD="/opt/homebrew/bin/python3.12"
fi

echo "Using Python: $PYTHON_CMD"
echo ""

# Check if MCP is installed
if $PYTHON_CMD -c "import mcp" 2>/dev/null; then
    echo "✅ MCP is already installed!"
else
    echo "Installing MCP..."
    $PYTHON_CMD -m pip install "mcp[cli]"
    
    if [ $? -ne 0 ]; then
        echo "❌ MCP installation failed"
        echo "Try: $PYTHON_CMD -m pip install --upgrade pip"
        echo "Then: $PYTHON_CMD -m pip install 'mcp[cli]'"
        exit 1
    fi
fi

# Step 5: Configure environment
echo ""
echo "🔑 Step 5: Configure API Keys"
echo ""
echo "You need to update web/.env.local with your API keys:"
echo ""
echo "1. Supabase: https://supabase.com/dashboard"
echo "   - Get your project URL and anon key from Settings → API"
echo ""
echo "2. Anthropic: https://console.anthropic.com/"
echo "   - Create an API key"
echo ""
echo "Edit the file with: nano web/.env.local"
echo ""
wait_for_user

# Step 6: Run full setup
echo "🚀 Step 6: Running Full Setup"
echo ""
echo "Now I'll run the complete setup script..."
wait_for_user

# Update the setup script to use correct Python
sed -i.bak "s|python3|$PYTHON_CMD|g" setup-mcp.sh

# Run setup
./setup-mcp.sh

echo ""
echo "🎉 Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your API keys are configured in web/.env.local"
echo "2. Run: $PYTHON_CMD test-mcp.py"
echo "3. Restart Claude Desktop"
echo "4. Your AI assistant now has full stack access!"
echo ""
echo "Test with: $PYTHON_CMD test-mcp.py"