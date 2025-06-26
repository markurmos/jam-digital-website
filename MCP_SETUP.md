# MCP (Model Context Protocol) Setup Guide

## Prerequisites

MCP requires Python 3.10 or higher. Your current system has Python 3.9.6, which is not compatible.

## Installing Python 3.10+

### Option 1: Install Homebrew and Python (Recommended)

1. Install Homebrew:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Python:
   ```bash
   brew install python@3.12
   ```

### Option 2: Download from Python.org

1. Visit https://www.python.org/downloads/
2. Download Python 3.12 or later for macOS
3. Run the installer

### Option 3: Using pyenv

1. Install pyenv:
   ```bash
   curl https://pyenv.run | bash
   ```

2. Install Python:
   ```bash
   pyenv install 3.12.0
   pyenv global 3.12.0
   ```

## Installing MCP

Once you have Python 3.10+, install MCP:

```bash
pip install "mcp[cli]"
```

Or if you're using a specific Python version:

```bash
python3.12 -m pip install "mcp[cli]"
```

## Testing Your MCP Server

After installing MCP, you can test the unified-stack server:

```bash
# Navigate to the web backend directory
cd unified-stack-demo/web/backend

# Run the MCP server
mcp run mcp-servers/unified-stack-server.py
```

Or use the MCP inspector for development:

```bash
mcp dev mcp-servers/unified-stack-server.py
```

## Using MCP with Claude Desktop

1. Install MCP as described above
2. Configure Claude Desktop by editing the config file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Add your server configuration:
   ```json
   {
     "mcpServers": {
       "unified-stack": {
         "command": "python",
         "args": [
           "/absolute/path/to/unified-stack-demo/web/backend/mcp-servers/unified-stack-server.py"
         ]
       }
     }
   }
   ```

4. Restart Claude Desktop

## MCP Configuration File

The MCP configuration is already set up in:
- `unified-stack-demo/mcp-config.json`

This file defines the unified-stack server that provides tools for:
- Creating Next.js components
- Querying Supabase
- Generating and processing images
- Deploying to Vercel

## Troubleshooting

1. **Python version error**: Make sure you have Python 3.10+ installed
2. **Command not found**: Ensure pip/python binaries are in your PATH
3. **Permission errors**: Use `--user` flag with pip or use a virtual environment

## Next Steps

1. Install Python 3.10 or higher
2. Install MCP package
3. Test the server with `mcp dev`
4. Configure Claude Desktop or other MCP clients
5. Start using the unified stack tools! 