# 📚 Detailed MCP Installation Guide for macOS

## 🎯 Overview
This guide will walk you through installing Python 3.10+ and MCP on your Mac. Total time: ~15 minutes.

## 📋 Prerequisites Check

### Current Status:
- ✅ macOS (Darwin 24.5.0)
- ✅ MCP server files ready
- ❌ Python 3.9.6 (need 3.10+)
- ❌ Homebrew not installed
- ❌ MCP package not installed

---

## 🚀 Step 1: Open Terminal

1. Press `Command + Space` to open Spotlight
2. Type "Terminal"
3. Press Enter to open Terminal app

**What Terminal looks like:**
```
Last login: Wed Jun 26 10:00:00 on ttys000
markurmos@MacBook-Pro ~ %
```

---

## 🍺 Step 2: Install Homebrew

### 2.1 Copy the Installation Command

Copy this entire command:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2.2 Run the Installation

1. Click in Terminal window
2. Paste the command (`Command + V`)
3. Press `Enter`

### 2.3 What Will Happen:

```
==> This script will install:
/opt/homebrew/bin/brew
/opt/homebrew/share/doc/homebrew
...
==> The following new directories will be created:
/opt/homebrew/bin
/opt/homebrew/etc
...
Press RETURN/ENTER to continue or any other key to abort:
```

**Action**: Press `Enter`

### 2.4 Enter Your Password

```
==> /usr/bin/sudo /usr/sbin/chown -R markurmos:admin /opt/homebrew
Password:
```

**Action**: Type your Mac password (it won't show as you type) and press `Enter`

### 2.5 Wait for Installation

This takes 2-5 minutes. You'll see lots of text scrolling by.

### 2.6 IMPORTANT: Add Homebrew to PATH

After installation completes, you'll see:
```
==> Next steps:
- Run these two commands in your terminal to add Homebrew to your PATH:
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
```

**Action**: Copy and run BOTH commands exactly as shown in YOUR terminal output.

### 2.7 Verify Homebrew Installation

Run:
```bash
brew --version
```

**Expected output:**
```
Homebrew 4.3.x
```

### 🔧 Troubleshooting Homebrew

**If "brew: command not found":**
1. Close Terminal completely (`Command + Q`)
2. Open Terminal again
3. Try `brew --version` again

**If still not working:**
```bash
echo $PATH
```
Should include `/opt/homebrew/bin`

---

## 🐍 Step 3: Install Python 3.12

### 3.1 Run Installation Command

```bash
brew install python@3.12
```

### 3.2 What You'll See:

```
==> Downloading https://ghcr.io/v2/homebrew/core/python/3.12/...
==> Installing python@3.12
==> Pouring python@3.12--3.12.x.arm64_sonoma.bottle.tar.gz
🍺  /opt/homebrew/Cellar/python@3.12/3.12.x: X,XXX files, XXX.XMB
```

This takes 1-3 minutes.

### 3.3 Verify Python Installation

```bash
python3.12 --version
```

**Expected output:**
```
Python 3.12.x
```

### 🔧 Troubleshooting Python

**If "python3.12: command not found":**

Try the full path:
```bash
/opt/homebrew/bin/python3.12 --version
```

If that works, add to PATH:
```bash
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## 📦 Step 4: Navigate to Your Project

```bash
cd /Users/markurmos/Projects/unified-stack-demo
```

Verify you're in the right place:
```bash
pwd
```

**Expected output:**
```
/Users/markurmos/Projects/unified-stack-demo
```

---

## 🚀 Step 5: Run the Automated Setup

### 5.1 Run Setup Script

```bash
./setup-mcp.sh
```

### 5.2 What the Script Does:

1. ✅ Checks Python version
2. ✅ Installs MCP package
3. ✅ Updates configuration files
4. ✅ Creates Claude Desktop config
5. ⚠️  Checks for API keys

### 5.3 Expected Output:

```
🚀 Unified Stack MCP Setup
==========================
📋 Checking Python installation...
✅ Found python3.12 (version 3.12.x)
📦 Checking MCP installation...
⚠️  MCP not installed. Installing now...
✅ MCP installed successfully
🔧 Updating MCP configuration...
✅ Updated mcp-config.json to use python3.12
🔑 Checking environment variables...
⚠️  Missing environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - ANTHROPIC_API_KEY
```

---

## 🔑 Step 6: Configure API Keys

### 6.1 Open Environment File

```bash
nano web/.env.local
```

### 6.2 You'll See:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 6.3 Get Your API Keys:

#### Supabase Keys:
1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Click "Settings" → "API"
4. Copy:
   - Project URL → paste replacing `your_supabase_url`
   - anon public key → paste replacing `your_supabase_anon_key`
   - service_role key → paste replacing `your_service_role_key`

#### Anthropic API Key:
1. Go to https://console.anthropic.com/
2. Click "API Keys"
3. Create new key
4. Copy and paste replacing `your_anthropic_api_key`

### 6.4 Save and Exit:
- Press `Control + X`
- Press `Y` to confirm
- Press `Enter` to save

---

## 🧪 Step 7: Test Everything

### 7.1 Run Test Suite

```bash
python3.12 test-mcp.py
```

### 7.2 Expected Output (Success):

```
🧪 MCP Server Test Suite
========================

📋 Testing: Python Version
✅ Python 3.12.x is compatible

📋 Testing: MCP Installation
✅ MCP is installed

📋 Testing: Server File
✅ Server file looks valid

📋 Testing: Config File
✅ Config file is valid

📋 Testing: Environment Variables
✅ Environment variables are configured

📋 Testing: Server Syntax
✅ Server file has valid Python syntax

==================================================
📊 Test Results Summary
==================================================
✅ PASS: Python Version
✅ PASS: MCP Installation
✅ PASS: Server File
✅ PASS: Config File
✅ PASS: Environment Variables
✅ PASS: Server Syntax

Score: 6/6 tests passed

🎉 All tests passed! Your MCP server is ready to use.
```

---

## 🎯 Step 8: Configure Claude Desktop

### 8.1 Close Claude Desktop
- Right-click Claude icon in dock
- Select "Quit"

### 8.2 Verify Configuration

```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Should show:
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

### 8.3 Restart Claude Desktop
- Open Claude Desktop
- Ask: "Show me available MCP tools"

---

## 🔧 Common Issues & Solutions

### Issue: "permission denied" when running scripts

**Solution:**
```bash
chmod +x setup-mcp.sh
chmod +x test-mcp.py
```

### Issue: "brew: command not found" after installation

**Solution:**
```bash
# For Apple Silicon Macs:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs:
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### Issue: "No module named mcp"

**Solution:**
```bash
python3.12 -m pip install --upgrade pip
python3.12 -m pip install "mcp[cli]"
```

### Issue: Claude doesn't see MCP tools

**Solution:**
1. Completely quit Claude Desktop
2. Check config: `cat ~/Library/Application\ Support/Claude/claude_desktop_config.json`
3. Restart Claude Desktop
4. Try: "What MCP servers are available?"

### Issue: API key errors

**Solution:**
- Make sure there are NO quotes around your API keys
- Ensure no extra spaces before/after keys
- Test Supabase connection: https://supabase.com/dashboard → your project should be active

---

## ✅ Success Checklist

- [ ] Terminal is open
- [ ] Homebrew installed (`brew --version` works)
- [ ] Python 3.12 installed (`python3.12 --version` shows 3.12.x)
- [ ] In project directory (`pwd` shows unified-stack-demo)
- [ ] Setup script ran successfully
- [ ] API keys configured in `web/.env.local`
- [ ] Test shows 6/6 passing
- [ ] Claude Desktop restarted

---

## 🎉 You're Done!

### Test Your Setup:

1. **In Claude Desktop, try:**
   - "Show me the available MCP tools"
   - "Create a simple Button component"
   - "What tables are in my database?"

2. **In Terminal, you can also test:**
   ```bash
   mcp dev web/backend/mcp-servers/unified-stack-server.py
   ```

### What You Can Do Now:

- 🧩 **Create Components**: "Create a UserCard component with TypeScript"
- 🗄️ **Database Queries**: "Show me all users in the database"
- 🎨 **Generate Images**: "Create a hero image for my landing page"
- 🚀 **Deploy**: "Deploy this app to Vercel"

---

## 📞 Need Help?

1. **Run diagnostics:**
   ```bash
   python3.12 test-mcp.py
   ```

2. **Check logs:**
   ```bash
   mcp dev web/backend/mcp-servers/unified-stack-server.py
   ```

3. **Verify paths:**
   ```bash
   which python3.12
   which mcp
   pwd
   ```

Your AI-powered development environment is now ready! 🚀