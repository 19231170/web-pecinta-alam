# MAPALA Organization Website

## Deployment Guide

### Prerequisites
- Node.js 16+ (18.x recommended)
- PostgreSQL database (can be hosted on services like Supabase, Railway, etc.)

### Deployment Steps

#### 1. Set up a Vercel account
If you don't have one already, sign up for a [Vercel account](https://vercel.com/signup).

#### 2. Connect your GitHub repository
- Log in to your Vercel account
- Click "Add New..." -> "Project"
- Import your GitHub repository
- Configure the project:
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

#### 3. Set Environment Variables
In your Vercel project settings, add these environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A secure random string for NextAuth
- `NEXTAUTH_URL`: The URL of your deployed application

#### 4. Deploy
Click "Deploy" and wait for the build process to complete.

#### 5. Database Migration
After deployment, you can run the migration command:
```
npx prisma migrate deploy
```

Or use the Vercel CLI to run it automatically:
```
vercel --prod
```

#### 6. Verify Deployment
- Check if the application is accessible at your Vercel URL
- Test authentication and other features

### Troubleshooting
- If images or styles aren't loading, check for path issues
- For database connection issues, verify your connection string
- For auth issues, make sure NEXTAUTH_URL is set correctly

### Updating the Deployment
After making changes to your code, simply push to your main branch, and Vercel will automatically redeploy your application.

## Local Development
```
npm install
npx prisma migrate dev
npm run dev
```

## Environment Variables
See `.env.example` for required environment variables.
