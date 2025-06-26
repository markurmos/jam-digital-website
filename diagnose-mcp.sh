#!/bin/bash

# MCP Diagnostic Script
# This script helps diagnose and fix common MCP installation issues

echo "🔍 MCP Diagnostic Tool"
echo "====================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        echo -e "${YELLOW}  Fix:${NC} $3"
    fi
}

# Check 1: Operating System
echo "1. Checking Operating System..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_status 0 "macOS detected ($(sw_vers -productVersion))"
else
    print_status 1 "Not running on macOS" "This guide is for macOS only"
fi
echo ""

# Check 2: Terminal Environment
echo "2. Checking Terminal Environment..."
if [ -n "$TERM" ]; then
    print_status 0 "Running in terminal: $TERM"
else
    print_status 1 "Not running in proper terminal" "Open Terminal.app and run this script"
fi
echo ""

# Check 3: Homebrew
echo "3. Checking Homebrew..."
if command -v brew &> /dev/null; then
    BREW_VERSION=$(brew --version | head -n 1)
    print_status 0 "Homebrew installed: $BREW_VERSION"
    
    # Check Homebrew path
    BREW_PATH=$(which brew)
    echo "   Location: $BREW_PATH"
else
    print_status 1 "Homebrew not installed" "Run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "   After installation, add to PATH:"
    echo "   echo 'eval \"\$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile"
    echo "   eval \"\$(/opt/homebrew/bin/brew shellenv)\""
fi
echo ""

# Check 4: Python versions
echo "4. Checking Python installations..."
PYTHON_FOUND=false
for version in 3.12 3.11 3.10; do
    if command -v python$version &> /dev/null; then
        PY_VERSION=$(python$version --version 2>&1)
        print_status 0 "Python $version found: $PY_VERSION"
        PYTHON_FOUND=true
        PYTHON_CMD="python$version"
        break
    fi
done

if [ "$PYTHON_FOUND" = false ]; then
    print_status 1 "No Python 3.10+ found" "Run: brew install python@3.12"
    
    # Check if Python 3.12 exists but not in PATH
    if [ -f "/opt/homebrew/bin/python3.12" ]; then
        echo -e "${YELLOW}  Note:${NC} Python 3.12 exists at /opt/homebrew/bin/python3.12 but not in PATH"
        echo "  Add to PATH: export PATH=\"/opt/homebrew/bin:\$PATH\""
    fi
fi
echo ""

# Check 5: Current directory
echo "5. Checking current directory..."
EXPECTED_DIR="/Users/markurmos/Projects/unified-stack-demo"
CURRENT_DIR=$(pwd)
if [ "$CURRENT_DIR" = "$EXPECTED_DIR" ]; then
    print_status 0 "In correct directory: $CURRENT_DIR"
else
    print_status 1 "Wrong directory: $CURRENT_DIR" "Run: cd $EXPECTED_DIR"
fi
echo ""

# Check 6: MCP files exist
echo "6. Checking MCP files..."
FILES_TO_CHECK=(
    "setup-mcp.sh"
    "test-mcp.py"
    "mcp-config.json"
    "web/backend/mcp-servers/unified-stack-server.py"
    "web/.env.local"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Found: $file"
    else
        print_status 1 "Missing: $file" "Make sure you're in the right directory"
    fi
done
echo ""

# Check 7: MCP Python package
echo "7. Checking MCP package..."
if [ "$PYTHON_FOUND" = true ]; then
    if $PYTHON_CMD -c "import mcp" 2>/dev/null; then
        print_status 0 "MCP package is installed"
    else
        print_status 1 "MCP package not installed" "Run: $PYTHON_CMD -m pip install 'mcp[cli]'"
    fi
fi
echo ""

# Check 8: Environment variables
echo "8. Checking environment variables..."
if [ -f "web/.env.local" ]; then
    # Check for placeholder values
    PLACEHOLDERS=$(grep -E "your_|=\s*$" web/.env.local | grep -v "^#" || true)
    if [ -z "$PLACEHOLDERS" ]; then
        print_status 0 "Environment variables look configured"
    else
        print_status 1 "Environment variables have placeholders" "Edit web/.env.local and add your real API keys"
        echo ""
        echo "   Placeholders found:"
        echo "$PLACEHOLDERS" | sed 's/^/   /'
    fi
else
    print_status 1 "web/.env.local not found" "Copy from .env.example or create it"
fi
echo ""

# Check 9: Claude Desktop config
echo "9. Checking Claude Desktop configuration..."
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$CLAUDE_CONFIG" ]; then
    if grep -q "unified-stack" "$CLAUDE_CONFIG"; then
        print_status 0 "Claude Desktop configured for MCP"
    else
        print_status 1 "Claude Desktop not configured for unified-stack" "Run: ./setup-mcp.sh"
    fi
else
    print_status 1 "Claude Desktop config not found" "Run: ./setup-mcp.sh"
fi
echo ""

# Summary
echo "===================="
echo "📊 Diagnostic Summary"
echo "===================="

# Provide next steps based on findings
if [ "$PYTHON_FOUND" = false ]; then
    echo -e "${YELLOW}Next Step:${NC} Install Python 3.12"
    echo "Run: brew install python@3.12"
elif [ ! -f "setup-mcp.sh" ]; then
    echo -e "${YELLOW}Next Step:${NC} Navigate to correct directory"
    echo "Run: cd $EXPECTED_DIR"
elif ! $PYTHON_CMD -c "import mcp" 2>/dev/null; then
    echo -e "${YELLOW}Next Step:${NC} Install MCP package"
    echo "Run: $PYTHON_CMD -m pip install 'mcp[cli]'"
elif [ -n "$PLACEHOLDERS" ]; then
    echo -e "${YELLOW}Next Step:${NC} Configure API keys"
    echo "Run: nano web/.env.local"
else
    echo -e "${GREEN}Everything looks good!${NC}"
    echo "Run: $PYTHON_CMD test-mcp.py"
fi

echo ""
echo "For detailed help, see:"
echo "- DETAILED_INSTALL_GUIDE.md"
echo "- QUICK_START_VISUAL.md"