// Script to test database connection
// Run with: node scripts/test-db-connection.js

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.error('Please set DATABASE_URL in your .env file or environment variables.');
    process.exit(1);
  }
  
  console.log(`📊 Using database URL: ${process.env.DATABASE_URL.replace(/(postgresql:\/\/[^:]+:)[^@]+(@.+)/, '$1******$2')}`);
  
  const prisma = new PrismaClient();
  
  try {
    // Test the connection with a simple query
    console.log('🔄 Connecting to database...');
    await prisma.$connect();
    
    // Get database information
    const result = await prisma.$queryRaw`SELECT current_database(), version();`;
    console.log('✅ Successfully connected to the database!');
    console.log(`📋 Database name: ${result[0].current_database}`);
    console.log(`📋 PostgreSQL version: ${result[0].version.split(' on ')[0]}`);
    
    // Check for tables
    const tablesResult = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    if (tablesResult.length === 0) {
      console.log('ℹ️ No tables found in the database. You may need to run migrations.');
    } else {
      console.log(`📋 Found ${tablesResult.length} tables in the database:`);
      tablesResult.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    console.log('🎉 Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
