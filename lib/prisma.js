import { PrismaClient } from '@prisma/client';

// Enhanced build time detection with better error handling
const isBuildTime = (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) || 
                   process.env.VERCEL_ENV === 'development' ||
                   process.env.NEXT_PHASE === 'phase-production-build' ||
                   (process.env.npm_lifecycle_script && 
                    process.env.npm_lifecycle_script.includes('next build')) ||
                   process.env.VERCEL; // Additional Vercel-specific detection

// Log environment information for debugging
if (isBuildTime) {
  console.log('🏗️ Build-time environment detected, using mock PrismaClient');
  console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}, VERCEL_ENV=${process.env.VERCEL_ENV || 'not set'}`);
  
  // If DATABASE_URL is missing but we're in production, provide warning
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    console.warn('⚠️ Warning: DATABASE_URL is not set in production environment');
    console.warn('⚠️ Set DATABASE_URL in your Vercel environment variables');
    
    // Set a placeholder for build time only
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = 'postgresql://placeholder:placeholder@localhost:5432/placeholder_db';
      console.log('🔄 Set placeholder DATABASE_URL for build process');
    }
  }
}

// Create a mock client for build time to prevent connection attempts
class PrismaMock {
  constructor() {
    return new Proxy(this, {
      get: (target, prop) => {
        // Return empty objects/functions for all Prisma methods
        if (typeof prop === 'string') {
          return new Proxy({}, {
            get: () => async () => {
              console.log(`[Build Time] Prisma ${prop} operation mocked`);
              return null;
            }
          });
        }
        return undefined;
      }
    });
  }
}

const globalForPrisma = globalThis;

// Use the real client only at runtime
export const prisma = globalForPrisma.prisma ?? 
  (isBuildTime 
    ? new PrismaMock()
    : new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
  );

// Use globalThis to prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
