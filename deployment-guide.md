# Deployment Guide for Multiple Projects

## Overview
This guide covers how to set up a professional hosting infrastructure for jamdigital.com and multiple development projects.

## 1. Domain Setup

### Primary Domain (jamdigital.com)
1. **Domain Registrar**: Use Cloudflare for DNS management
   - Better performance with Cloudflare's CDN
   - Free SSL certificates
   - DDoS protection

2. **Subdomain Structure**:
   ```
   jamdigital.com          → Main website (Vercel)
   app.jamdigital.com      → Main application
   dev.jamdigital.com      → Development preview
   api.jamdigital.com      → API endpoints (Vercel Functions)
   staging.jamdigital.com  → Staging environment
   
   # Client/Project subdomains
   project1.jamdigital.com
   project2.jamdigital.com
   ```

## 2. Vercel Setup

### Initial Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel

# Link to GitHub for automatic deployments
vercel link
```

### Project Configuration
Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Environment Variables
```bash
# Production
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add ANTHROPIC_API_KEY

# Preview (for branches)
vercel env add SUPABASE_URL preview
vercel env add SUPABASE_ANON_KEY preview
```

## 3. GitHub Integration

### Repository Structure
```
github.com/yourusername/
├── jamdigital-main/        # Main website
├── jamdigital-projects/    # Monorepo for smaller projects
│   ├── apps/
│   │   ├── project1/
│   │   └── project2/
│   └── packages/
│       └── shared/
└── client-projects/        # Private client work
```

### Branch Strategy
```
main          → Production (jamdigital.com)
staging       → Staging (staging.jamdigital.com)
dev           → Development (dev.jamdigital.com)
feature/*     → Preview URLs (feature-name.jamdigital.vercel.app)
```

## 4. Supabase Configuration

### Project Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push database migrations
supabase db push
```

### Multiple Environments
```
Production: jamdigital-prod
Staging: jamdigital-staging
Development: jamdigital-dev (free tier)
```

## 5. Development Workflow

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/jamdigital-main

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Deployment Process
```bash
# Feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature
# → Creates preview at: feature-new-feature.jamdigital.vercel.app

# Merge to staging
git checkout staging
git merge feature/new-feature
git push origin staging
# → Deploys to: staging.jamdigital.com

# Merge to production
git checkout main
git merge staging
git push origin main
# → Deploys to: jamdigital.com
```

## 6. Monitoring & Analytics

### Vercel Analytics
- Built-in Web Vitals monitoring
- Real User Metrics
- Custom events tracking

### Additional Tools
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 7. Cost Optimization

### Free Tier Maximization
1. **Vercel Hobby**:
   - 100GB bandwidth
   - Unlimited projects
   - Preview deployments

2. **Supabase Free**:
   - 2 projects
   - 500MB database
   - 50,000 auth users

3. **Cloudflare Free**:
   - Unlimited bandwidth
   - Free SSL
   - Basic analytics

### When to Upgrade
- **Vercel Pro**: When you need commercial use, team features, or more bandwidth
- **Supabase Pro**: When you exceed 500MB database or need better performance
- **AWS**: Only for specific needs (large file storage, custom compute)

## 8. Security Best Practices

### Environment Variables
```bash
# Never commit these to git
.env.local
.env.production

# Use Vercel's environment variable UI
# Different values for preview vs production
```

### API Security
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect API routes
  if (req.nextUrl.pathname.startsWith('/api/protected')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}
```

## 9. Project Templates

### Create Reusable Templates
```bash
# Create a template repository
gh repo create jamdigital-template --template

# Use for new projects
gh repo create new-project --template jamdigital-template
```

### Standardized Structure
```
project-template/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── .env.example
├── vercel.json
└── README.md
```

## 10. Client Project Management

### Separate Vercel Teams
1. Personal/JAM Digital team for your projects
2. Create separate teams for client projects
3. Transfer ownership when project completes

### Billing
- Use Vercel Teams to separate billing
- Client can take over their own Vercel account
- Clear handoff process

## Summary

**Recommended Stack**:
- **Hosting**: Vercel (web) + Supabase (database)
- **DNS**: Cloudflare
- **Monitoring**: Vercel Analytics
- **Version Control**: GitHub with branch previews
- **Development**: Local → Preview → Staging → Production

**Monthly Costs** (estimated):
- Starting: $0 (free tiers)
- Growing: $45/month (Vercel Pro + Supabase Pro)
- Scale: Add AWS services as needed

This setup gives you professional infrastructure with minimal complexity and cost. 