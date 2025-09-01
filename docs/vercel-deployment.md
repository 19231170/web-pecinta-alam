# Vercel Deployment Guide

## Prerequisites
- A Vercel account connected to your GitHub repository
- A PostgreSQL database (you can use Vercel Postgres, Railway, Supabase, etc.)
- Your code committed to the main branch

## Setting Up Environment Variables

### 1. Required Environment Variables
Before deploying, make sure to set these environment variables in Vercel:

- `DATABASE_URL`: Your PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://postgres:mypassword@db.example.com:5432/mapala_db`

- `NEXTAUTH_SECRET`: A secret key for NextAuth.js authentication
  - Generate one with: `openssl rand -base64 32`
  - Or use a strong random string

- `NEXTAUTH_URL`: Your application's URL
  - For production: `https://your-app-name.vercel.app`
  - For preview: Can be set automatically by Vercel

### 2. Setting Environment Variables in Vercel Dashboard
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add each variable with its name and value
5. Select the environments where each variable should be available:
   - Production: For your main deployment
   - Preview: For pull request previews
   - Development: For local development with Vercel CLI

### 3. PostgreSQL Setup
If using Vercel Postgres:
1. Go to "Storage" in your Vercel dashboard
2. Create a new PostgreSQL database
3. Copy the connection string and use it for your `DATABASE_URL` environment variable

For external PostgreSQL providers:
1. Make sure your database allows connections from Vercel's IP addresses
2. Use the connection string provided by your database service

## Troubleshooting

### Database Connection Issues
- Check if your DATABASE_URL is correctly formatted
- Ensure your database allows connections from Vercel's IP addresses
- Verify your database credentials are correct

### Build Failures
If your build fails with Prisma errors:
1. Check Vercel build logs for specific error messages
2. Ensure all required environment variables are set
3. Try manually running migrations in the database before deploying

## Deployment Process

When you push to your main branch, Vercel will:
1. Clone your repository
2. Install dependencies with `npm install`
3. Run your build script: `npm run vercel-build`
   - This generates Prisma Client
   - Runs database migrations
   - Seeds the database if needed
   - Builds your Next.js application
4. Deploy your application

For more help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
