# 🚀 MCP Quick Reference

## ⚡ Getting Started (15 minutes)

### 1. Install Python 3.10+
```bash
brew install python@3.12
```

### 2. Run Setup Script
```bash
./setup-mcp.sh
```

### 3. Configure API Keys
Edit `web/.env.local` with your real API keys from:
- **Supabase**: https://supabase.com/dashboard
- **Anthropic**: https://console.anthropic.com/

### 4. Test Everything
```bash
python3.12 test-mcp.py
```

## 🎯 Once Working, Try These Commands:

### 🧩 Component Generation
> "Create a React component for a user profile card with name, email, and avatar"

### 🗄️ Database Operations  
> "Show me all tables in the database"
> "Query the users table and show the first 10 records"

### 🎨 Image Generation
> "Generate a hero image for a tech startup website"

### 🚀 Deployment
> "Deploy this app to Vercel"

## 📁 Key Files

| File | Purpose |
|------|---------|
| `NEXT_STEPS.md` | Complete setup guide |
| `setup-mcp.sh` | Automated setup script |
| `test-mcp.py` | Test if everything works |
| `web/backend/mcp-servers/unified-stack-server.py` | MCP server |
| `mcp-config.json` | MCP configuration |
| `web/.env.local` | API keys |

## 🛠️ Available MCP Tools

| Tool | Description |
|------|-------------|
| `create_nextjs_component` | Generate React components |
| `create_nextjs_page` | Create new pages |
| `create_api_route` | Build API endpoints |
| `query_supabase` | Database operations |
| `create_supabase_table` | Create tables |
| `insert_supabase_data` | Add data |
| `generate_image` | AI image generation |
| `analyze_image` | Image analysis |
| `deploy_to_vercel` | Deploy to production |

## 🔧 Troubleshooting

### Test fails? Run this first:
```bash
python3.12 test-mcp.py
```

### Claude Desktop not seeing MCP?
1. Close Claude Desktop completely
2. Run `./setup-mcp.sh` again  
3. Restart Claude Desktop

### API errors?
Check your `.env.local` file has real API keys (not placeholders)

## 🎉 Success Indicators

✅ **Test shows 6/6 passing**  
✅ **Claude Desktop shows MCP tools**  
✅ **AI can create components**  
✅ **AI can query database**  

You're ready for AI-powered development! 🚀