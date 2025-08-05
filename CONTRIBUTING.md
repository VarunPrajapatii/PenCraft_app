# PenCraft Database Setup Guide

## Overview
This guide explains how to properly configure your development and production environments for PenCraft, which uses both direct PostgreSQL connections and Prisma Accelerate.

## Database URLs Explained

1. **Aiven PostgreSQL (Direct Database)**
   ```
   postgres://......
   ```
   - This is your actual database hosted on Aiven
   - Use for development (faster, easier to debug)

2. **Prisma Accelerate (Caching Layer)**
   ```
   prisma://accelerate.prisma-data.net/?api_key=eyJhbGciO...
   ```
   - This provides connection pooling and caching over your Aiven database
   - Use for production (better performance for serverless)

## Development Setup

### Files Configuration

#### `backend/.dev.vars` (for local development)
```env
# Use Prisma Accelerate URL for both development and production
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGc....xzttJM6k1e_pOYimFfs0_y5Ew_HdH8exuiVGBkIi8pc"
JWT_SECRET="..."
AWS_REGION=...
S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

#### `backend/wrangler.toml`
```toml
name = "pencraft-api"
account_id = "7f8d02..."
workers_dev = true
compatibility_date = "2023-12-01"

# No [vars] section - use .dev.vars for dev and secrets for production
```

#### `backend/.env` (keep empty for security)
```env
# This file should not contain any actual environment variables
# Use .dev.vars for development (local wrangler dev)
# Use Cloudflare Workers secrets for production deployment
```

### Development Commands

```bash
cd backend

# Install dependencies
npm install

# Run development server (uses .dev.vars with direct DB connection)
npm run dev
# or
npx wrangler dev
```

## Production Setup

### Set Production Secrets
```bash
cd backend

# Set database URL (use Prisma Accelerate for production)
npx wrangler secret put DATABASE_URL
# Enter: prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Set other secrets
npx wrangler secret put JWT_SECRET
npx wrangler secret put AWS_REGION  
npx wrangler secret put S3_BUCKET
npx wrangler secret put AWS_ACCESS_KEY_ID
npx wrangler secret put AWS_SECRET_ACCESS_KEY
```

### Production Deployment
```bash
cd backend

# Deploy to Cloudflare Workers
npm run deploy
# or
npx wrangler deploy
```

## ✅ SOLUTION: The Key Fix

**The Problem**: Using `@prisma/client/edge` import for development with direct PostgreSQL URLs causes the protocol error.

**The Solution**: Use the correct Prisma Client import for your environment:

### Development (Local)
- **Import**: `import { PrismaClient } from '@prisma/client'`
- **Database URL**: Direct PostgreSQL connection (`postgres://...`)
- **Accelerate**: Not used

### Production (Cloudflare Workers)
- **Import**: `import { PrismaClient } from '@prisma/client/edge'` 
- **Database URL**: Prisma Accelerate URL (`prisma://...`)
- **Accelerate**: Used with `.$extends(withAccelerate())`

## Code Implementation

The backend uses a helper function that automatically chooses between direct connection and Accelerate based on the URL:

```typescript
// Helper function to create Prisma client with conditional Accelerate
function createPrismaClient(databaseUrl: string) {
  const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
  });
  
  // For development, we don't use Accelerate at all
  // Only use Accelerate in production when URL starts with prisma://
  if (databaseUrl.startsWith('prisma://')) {
    return prisma.$extends(withAccelerate()) as any;
  }
  
  // For development with postgres:// URLs, return the plain client
  return prisma;
}
```

**Key Points:**
1. Development uses `@prisma/client` import (not `/edge`)
2. Production uses `@prisma/client/edge` import  
3. The helper function handles URL-based switching automatically
4. Generate client without `--no-engine` flag for development

## Environment Summary

| Environment | Database URL | Performance | Use Case |
|-------------|-------------|-------------|----------|
| Development | Direct PostgreSQL | Good | Local development, debugging |
| Production | Prisma Accelerate | Better | Deployed app, serverless optimized |

## Security Notes

1. **Never commit secrets to git**
   - `.dev.vars` should be in `.gitignore`
   - `.env` should remain empty
   - Use Cloudflare Workers secrets for production

2. **File Hierarchy**
   - Development: `.dev.vars` (local only)
   - Production: Cloudflare Workers secrets (secure)
   - Git: Only configuration files, no secrets

## Troubleshooting

### Error: "URL must start with protocol prisma://"
- **Cause**: Using `withAccelerate()` with a direct PostgreSQL URL
- **Solution**: The helper function automatically handles this based on URL type

### Error: "Environment variables not found"  
- **Development**: Check `.dev.vars` file exists with correct values
- **Production**: Verify secrets are set with `npx wrangler secret list`
