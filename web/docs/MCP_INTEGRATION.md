# MCP (Model Context Protocol) Integration Guide

## What is MCP?

MCP enables AI assistants to:
- **Access external tools** - Run code, query databases, call APIs
- **Read resources** - Access files, databases, web content
- **Maintain context** - Share state between conversations
- **Execute actions** - Perform tasks on behalf of users

## 🚀 What MCP Unlocks for Your Stack

### 1. **Database Operations**
```python
# Direct database queries from AI
- Create/update records
- Generate reports
- Data analysis
- Schema modifications
```

### 2. **File System Access**
```python
# Manage project files
- Read/write code files
- Update configurations
- Generate components
- Refactor codebase
```

### 3. **API Integrations**
```python
# Connect to any service
- Stripe payments
- SendGrid emails
- Third-party APIs
- Webhook handling
```

### 4. **Development Automation**
```python
# AI-powered development
- Auto-generate CRUD operations
- Create API endpoints
- Build UI components
- Write tests
```

## 📦 MCP Servers for Your Stack

### 1. **Supabase MCP Server**
Enables AI to directly interact with your database:

```python
# backend/mcp-servers/supabase_mcp_server.py
import asyncio
from mcp import Server, Tool, Resource
from supabase import create_client

class SupabaseMCPServer:
    def __init__(self, url, key):
        self.supabase = create_client(url, key)
        self.server = Server("supabase-unified-stack")
        
        # Register tools
        self.server.add_tool(Tool(
            name="query_database",
            description="Execute a database query",
            parameters={
                "table": "string",
                "query": "object",
                "operation": "select|insert|update|delete"
            },
            handler=self.query_database
        ))
        
        self.server.add_tool(Tool(
            name="manage_storage",
            description="Upload/download files from Supabase storage",
            parameters={
                "bucket": "string",
                "action": "upload|download|delete",
                "path": "string"
            },
            handler=self.manage_storage
        ))
        
    async def query_database(self, table, query, operation):
        # Execute database operations
        if operation == "select":
            return self.supabase.table(table).select("*").execute()
        elif operation == "insert":
            return self.supabase.table(table).insert(query).execute()
        # ... more operations
```

### 2. **Next.js Development Server**
AI can create and modify your Next.js app:

```typescript
// backend/mcp-servers/nextjs_mcp_server.ts
import { Server, Tool } from '@modelcontextprotocol/sdk'
import * as fs from 'fs/promises'
import * as path from 'path'

class NextJSMCPServer {
  constructor() {
    this.server = new Server({
      name: 'nextjs-unified-stack',
      version: '1.0.0'
    })
    
    // Create React component
    this.server.addTool({
      name: 'create_component',
      description: 'Create a new React component with TypeScript',
      parameters: {
        name: { type: 'string', required: true },
        type: { type: 'string', enum: ['page', 'component', 'layout'] },
        props: { type: 'object' }
      },
      handler: this.createComponent.bind(this)
    })
    
    // Create API route
    this.server.addTool({
      name: 'create_api_route',
      description: 'Create a new API route',
      parameters: {
        path: { type: 'string', required: true },
        methods: { type: 'array', items: { type: 'string' } }
      },
      handler: this.createAPIRoute.bind(this)
    })
  }
  
  async createComponent(params) {
    const template = `
'use client'

import { useState } from 'react'

interface ${params.name}Props {
  ${Object.entries(params.props || {})
    .map(([key, type]) => `${key}: ${type}`)
    .join('\n  ')}
}

export function ${params.name}({ ${Object.keys(params.props || {}).join(', ')} }: ${params.name}Props) {
  return (
    <div>
      {/* Component implementation */}
    </div>
  )
}`
    
    const filePath = params.type === 'page' 
      ? `src/app/${params.name.toLowerCase()}/page.tsx`
      : `src/components/${params.name}.tsx`
      
    await fs.writeFile(filePath, template)
    return { created: filePath }
  }
}
```

### 3. **AI Image Generation Server**
Integrate all AI image services:

```python
# backend/mcp-servers/ai_image_mcp_server.py
class AIImageMCPServer:
    def __init__(self):
        self.server = Server("ai-image-unified-stack")
        
        self.server.add_tool(Tool(
            name="generate_image",
            description="Generate image with any AI service",
            parameters={
                "prompt": "string",
                "service": "dalle|stability|midjourney",
                "options": "object"
            },
            handler=self.generate_image
        ))
        
        self.server.add_tool(Tool(
            name="process_image",
            description="Process image through converter pipeline",
            parameters={
                "image_url": "string",
                "operations": ["resize", "format", "optimize"],
                "upload_to_supabase": "boolean"
            },
            handler=self.process_image
        ))
```

## 🔧 MCP Configuration

Create `mcp-config.json` in your project root:

```json
{
  "version": "1.0.0",
  "servers": {
    "unified-stack-supabase": {
      "name": "Unified Stack Supabase",
      "command": "python3",
      "args": ["backend/mcp-servers/supabase_server.py"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_KEY": "${SUPABASE_KEY}"
      }
    },
    "unified-stack-nextjs": {
      "name": "Unified Stack Next.js",
      "command": "node",
      "args": ["backend/mcp-servers/nextjs_server.js"],
      "env": {
        "PROJECT_ROOT": "./web"
      }
    },
    "unified-stack-ai": {
      "name": "Unified Stack AI",
      "command": "python3",
      "args": ["backend/mcp-servers/ai_server.py"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}",
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

## 🎯 Use Cases Enabled by MCP

### 1. **AI-Powered Development**
```typescript
// AI can now:
- Generate entire features (UI + API + Database)
- Refactor code across the entire codebase
- Create test suites automatically
- Update documentation in sync with code
```

### 2. **Intelligent Database Management**
```typescript
// AI can now:
- Optimize queries based on usage patterns
- Generate migration scripts
- Create seed data
- Analyze and report on data trends
```

### 3. **Automated Content Pipeline**
```typescript
// AI can now:
- Generate images → Process → Store → Create UI
- Write blog posts → Format → Publish
- Create product descriptions → Generate images → List
```

### 4. **DevOps Automation**
```typescript
// AI can now:
- Deploy to Vercel/Supabase
- Monitor errors and fix them
- Scale resources based on usage
- Generate performance reports
```

## 🚀 Quick Start

1. **Install MCP SDK**
```bash
# Python servers
pip install modelcontextprotocol

# Node.js servers
npm install @modelcontextprotocol/sdk
```

2. **Create your first MCP server**
```bash
mkdir -p backend/mcp-servers
# Copy one of the examples above
```

3. **Configure Claude/Cursor**
- Add `mcp-config.json` to your project
- Restart Claude Desktop or Cursor
- Your AI now has superpowers!

## 💡 Advanced Patterns

### Resource Providers
```python
# Expose data as resources AI can read
server.add_resource(Resource(
    uri="supabase://products/all",
    name="All Products",
    handler=lambda: supabase.table("products").select("*").execute()
))
```

### Event Streaming
```python
# AI can react to real-time events
server.add_event_stream(
    name="database_changes",
    handler=supabase.realtime.subscribe("*")
)
```

### Tool Composition
```python
# Combine multiple tools for complex operations
@server.tool("create_product_with_ai_image")
async def create_product_with_ai_image(name, description):
    # 1. Generate image with AI
    image = await generate_image(f"Product photo of {name}")
    
    # 2. Process and optimize
    processed = await process_image(image.url)
    
    # 3. Upload to Supabase
    storage_url = await upload_to_storage(processed)
    
    # 4. Create database record
    product = await supabase.table("products").insert({
        "name": name,
        "description": description,
        "image": storage_url
    }).execute()
    
    return product
```

## 🔒 Security Considerations

1. **API Key Management**
   - Use environment variables
   - Never expose in client code
   - Rotate regularly

2. **Permission Scoping**
   - Limit tool access per server
   - Use read-only where possible
   - Audit tool usage

3. **Data Validation**
   - Validate all inputs
   - Sanitize database queries
   - Rate limit API calls

## 🎉 What This Means

With MCP integrated into your unified stack:
- **10x faster development** - AI can build entire features
- **Self-healing systems** - AI can fix its own errors
- **Intelligent automation** - Beyond simple scripts
- **Context-aware assistance** - AI understands your entire stack

Your AI assistant becomes a true development partner that can:
- See your code
- Understand your database
- Execute changes
- Deploy updates
- Monitor results

This is the future of AI-assisted development! 🚀 