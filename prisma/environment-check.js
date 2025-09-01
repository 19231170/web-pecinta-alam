// This script checks for required environment variables before running Prisma commands
// It creates placeholder values for build-time only to prevent deployment failures

const fs = require('fs');
const path = require('path');

// Check if we're in a build environment
const isBuildEnv = process.env.VERCEL_ENV || 
                  process.env.NODE_ENV === 'production' || 
                  process.env.npm_lifecycle_script?.includes('next build');

// Create a temporary .env file if needed for build time
if (isBuildEnv && !process.env.DATABASE_URL) {
  console.log('🔧 Build environment detected without DATABASE_URL');
  console.log('🔧 Creating temporary environment variables for build');
  
  // Create a temporary .env file with a placeholder DATABASE_URL
  const envContent = `
# This is a temporary file created during build
# It will be overridden by actual environment variables in production
DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder_db"
`;

  // Write to a temporary .env file
  fs.writeFileSync(path.join(__dirname, '..', '.env.build'), envContent);
  
  // Set the environment variable for the current process
  process.env.DATABASE_URL = "postgresql://placeholder:placeholder@localhost:5432/placeholder_db";
  
  console.log('✅ Created temporary DATABASE_URL for build process');
}
