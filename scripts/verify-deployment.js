// This script verifies that all required environment variables are set for deployment
// Run it with: node scripts/verify-deployment.js

console.log('🔍 Verifying deployment configuration...');

// Check for required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('\nPlease set these in your Vercel project settings or .env file.');
  console.error('For Vercel deployment, add them under Project Settings > Environment Variables.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
}

// Verify package.json scripts
const packageJson = require('../package.json');
const requiredScripts = ['vercel-build', 'postinstall'];

const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

if (missingScripts.length > 0) {
  console.error('❌ Missing required scripts in package.json:', missingScripts.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required scripts are set in package.json!');
}

// Verify Prisma setup
try {
  console.log('📊 Verifying Prisma setup...');
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ @prisma/client is properly installed.');
} catch (error) {
  console.error('❌ Error with Prisma setup:', error.message);
  process.exit(1);
}

console.log('🚀 Deployment configuration looks good!');
