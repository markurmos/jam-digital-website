# 🚀 Quick Start: MCP Installation (Visual Guide)

## 📱 What We're Installing
```
┌─────────────────────────────────────────┐
│         Your Mac (macOS)                │
│  ┌─────────────────────────────────┐   │
│  │  🍺 Homebrew (Package Manager)  │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │  🐍 Python 3.12 (Programming)   │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │  📦 MCP (AI Protocol)           │   │
│  └──────────────┬──────────────────┘   │
│                 │                       │
│  ┌──────────────▼──────────────────┐   │
│  │  🤖 Claude Desktop + MCP Tools  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## ⏱️ Time Required: 15 Minutes

### ⏰ Time Breakdown:
- Install Homebrew: 5 minutes
- Install Python: 3 minutes
- Configure MCP: 5 minutes
- Add API keys: 2 minutes

---

## 📋 Step-by-Step Commands

### 1️⃣ Open Terminal
```
Spotlight (⌘ + Space) → Type "Terminal" → Press Enter
```

### 2️⃣ Install Homebrew
```bash
# Copy and paste this entire line:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# When prompted:
# - Press ENTER to continue
# - Type your password (won't show)
# - Wait for completion
```

### 3️⃣ Add Homebrew to PATH
```bash
# After Homebrew installs, it will show commands like these.
# Copy YOUR specific commands from the output:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 4️⃣ Install Python 3.12
```bash
brew install python@3.12
```

### 5️⃣ Go to Project
```bash
cd /Users/markurmos/Projects/unified-stack-demo
```

### 6️⃣ Run Setup
```bash
./setup-mcp.sh
```

### 7️⃣ Add Your API Keys
```bash
nano web/.env.local
```

**Replace these placeholders:**
```
your_supabase_url      → https://xxxxx.supabase.co
your_supabase_anon_key → eyJhbGc...xxxxx
your_anthropic_api_key → sk-ant-xxxxx
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

### 8️⃣ Test Everything
```bash
python3.12 test-mcp.py
```

---

## ✅ Success Looks Like This:

```
Score: 6/6 tests passed

🎉 All tests passed! Your MCP server is ready to use.
```

---

## 🚨 If Something Goes Wrong:

### "command not found" Errors:
```bash
# Close Terminal completely (⌘ + Q)
# Open Terminal again
# Try the command again
```

### Can't find Python 3.12:
```bash
# Try the full path:
/opt/homebrew/bin/python3.12 --version
```

### Permission denied:
```bash
# Make scripts executable:
chmod +x setup-mcp.sh
chmod +x test-mcp.py
```

---

## 🎯 Quick Test After Installation

### In Terminal:
```bash
# This should open an interactive MCP tester:
mcp dev web/backend/mcp-servers/unified-stack-server.py
```

### In Claude Desktop:
```
You: "What MCP tools are available?"

Claude: "I have access to these MCP tools:
- create_nextjs_component
- query_supabase  
- generate_image
- deploy_to_vercel
..."
```

---

## 📱 API Key Sources:

### 🔷 Supabase Keys:
```
1. https://supabase.com/dashboard
2. Click your project
3. Settings → API
4. Copy: Project URL, anon key, service role key
```

### 🤖 Anthropic Key:
```
1. https://console.anthropic.com/
2. API Keys → Create Key
3. Copy the key starting with sk-ant-
```

---

## 🏁 Final Checklist:

```
✓ Homebrew installed (brew --version)
✓ Python 3.12 installed (python3.12 --version)  
✓ MCP installed (setup script completed)
✓ API keys configured (no "your_" placeholders)
✓ Tests pass (6/6 in test-mcp.py)
✓ Claude Desktop restarted
```

---

## 🎊 Congratulations!

You now have AI superpowers! Try these in Claude:

```
"Create a UserProfile component with avatar and bio"
"Show me all tables in my Supabase database"
"Generate a hero image for a tech startup"
"Deploy my app to Vercel"
```

---

## 🆘 Still Stuck?

Run this diagnostic command:
```bash
python3.12 test-mcp.py
```

It will tell you exactly what's wrong and how to fix it!