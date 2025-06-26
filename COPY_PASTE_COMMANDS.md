# 📋 Copy & Paste Installation Commands

## ⚡ Quick Install (Copy these commands one by one)

### 1️⃣ Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2️⃣ Add Homebrew to PATH (AFTER Homebrew installs)
**⚠️ IMPORTANT: Use the commands shown in YOUR terminal output, not these examples**

For Apple Silicon Macs (M1/M2/M3):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

For Intel Macs:
```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

### 3️⃣ Install Python 3.12
```bash
brew install python@3.12
```

### 4️⃣ Navigate to Project
```bash
cd /Users/markurmos/Projects/unified-stack-demo
```

### 5️⃣ Run Setup Script
```bash
./setup-mcp.sh
```

### 6️⃣ Edit Environment Variables
```bash
nano web/.env.local
```

### 7️⃣ Test Installation
```bash
python3.12 test-mcp.py
```

### 8️⃣ (Optional) Run Diagnostics
```bash
./diagnose-mcp.sh
```

---

## 🔑 API Key Setup

When you run `nano web/.env.local`, replace these values:

### Supabase (from https://supabase.com/dashboard):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### Anthropic (from https://console.anthropic.com/):
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Save in nano:
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## ✅ Verification Commands

Check if everything is installed:
```bash
# Check Homebrew
brew --version

# Check Python
python3.12 --version

# Check MCP
python3.12 -c "import mcp; print('MCP installed')"

# Check current directory
pwd

# Run full test
python3.12 test-mcp.py
```

---

## 🚨 If Something Goes Wrong

### Reset Terminal:
```bash
source ~/.zshrc
```

### Check PATH:
```bash
echo $PATH
```

### Find Python:
```bash
which python3.12
ls /opt/homebrew/bin/python*
```

### Make scripts executable:
```bash
chmod +x setup-mcp.sh
chmod +x test-mcp.py
chmod +x diagnose-mcp.sh
```

### Re-run setup:
```bash
./setup-mcp.sh
```

---

## 🎯 Success Test

After everything is installed, test in Claude Desktop:
```
"Show me the available MCP tools"
```

Claude should respond with a list of tools like:
- create_nextjs_component
- query_supabase
- generate_image
- deploy_to_vercel

---

## 📞 Still Need Help?

Run the diagnostic tool:
```bash
./diagnose-mcp.sh
```

It will tell you exactly what's wrong and how to fix it!