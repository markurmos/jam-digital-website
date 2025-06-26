# Quick MCP Setup Guide

## Current Status
✅ Your MCP server implementation is ready  
✅ Configuration files are in place  
❌ Need Python 3.10+ (you have 3.9.6)  
❌ Need MCP package installed  

## Step 1: Install Python 3.12 (Choose One Option)

### Option A: Using Homebrew (Recommended)
Open Terminal and run these commands:

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to your PATH (the installer will tell you the exact command)
# It will be something like:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Python 3.12
brew install python@3.12

# Verify installation
python3.12 --version
```

### Option B: Download from Python.org
1. Go to https://www.python.org/downloads/
2. Download "Python 3.12.x" for macOS
3. Run the installer
4. Verify installation: `python3.12 --version`

## Step 2: Install MCP Package

```bash
# Install MCP with CLI tools
pip3.12 install "mcp[cli]"

# Verify installation
mcp --version
```

## Step 3: Test Your MCP Server

```bash
# Navigate to your project
cd /Users/markurmos/Projects/unified-stack-demo

# Test the server with MCP inspector
mcp dev web/backend/mcp-servers/unified-stack-server.py
```

## Step 4: Configure Claude Desktop (Optional)

Edit or create: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "unified-stack": {
      "command": "python3.12",
      "args": [
        "/Users/markurmos/Projects/unified-stack-demo/web/backend/mcp-servers/unified-stack-server.py"
      ]
    }
  }
}
```

## What Your MCP Server Can Do

Once installed, your AI assistant will have access to these tools:

🚀 **Development Tools:**
- `create_nextjs_component` - Generate React/TypeScript components
- `create_nextjs_page` - Create new Next.js pages
- `create_api_route` - Build API endpoints

🗄️ **Database Operations:**
- `query_supabase` - Execute SQL queries
- `create_supabase_table` - Create database tables
- `insert_supabase_data` - Add data to tables

🎨 **AI Image Generation:**
- `generate_image` - Create images with DALL-E
- `analyze_image` - Analyze uploaded images

☁️ **Deployment:**
- `deploy_to_vercel` - Deploy your app to Vercel
- `check_deployment_status` - Monitor deployments

## Troubleshooting

### If Python 3.12 command not found:
```bash
# Check what Python versions are available
ls /usr/local/bin/python*
ls /opt/homebrew/bin/python*

# Use the full path if needed
/opt/homebrew/bin/python3.12 --version
```

### If MCP installation fails:
```bash
# Try upgrading pip first
python3.12 -m pip install --upgrade pip

# Then install MCP
python3.12 -m pip install "mcp[cli]"
```

### If the MCP server test fails:
1. Check that all required environment variables are set
2. Verify your Supabase and OpenAI API keys
3. Check the server logs for specific errors

## Next Steps After Installation

1. ✅ Test the MCP server connection
2. ✅ Try creating a simple component
3. ✅ Test database queries
4. ✅ Generate an image
5. ✅ Deploy to Vercel

Your unified-stack project will then have full AI automation capabilities! 🎉