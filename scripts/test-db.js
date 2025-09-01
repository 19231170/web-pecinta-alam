// This file will help test database connectivity during build time
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const prisma = new PrismaClient();
    
    // Try to connect and perform a simple query
    const result = await prisma.$queryRaw`SELECT 1 as "connection_test"`;
    
    console.log('✅ Database connection successful!', result);
    
    // Clean up connection
    await prisma.$disconnect();
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Check common issues
    if (error.message.includes('connection')) {
      console.error('   - Check if your DATABASE_URL is correct');
      console.error('   - Verify that your database is accessible from Vercel');
    }
    
    return false;
  }
}

// Execute the test if this script is run directly
if (require.main === module) {
  testDatabaseConnection()
    .then(success => {
      if (!success) {
        console.error('Database connection test failed. Check logs above.');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Unexpected error during database test:', err);
      process.exit(1);
    });
}

module.exports = { testDatabaseConnection };
