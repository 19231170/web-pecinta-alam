import { PrismaClient } from '@prisma/client';

// Add a flag to detect build time vs runtime
// More comprehensive detection for Vercel build environment
const isBuildTime = (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) || 
                   process.env.VERCEL_ENV === 'development' ||
                   process.env.NEXT_PHASE === 'phase-production-build';

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
