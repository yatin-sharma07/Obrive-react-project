const { prisma } = require('./src/config/db');

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma connection...');
    
    // Test 1: Basic connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Basic connection: OK');
    
    // Test 2: Users table
    const userCount = await prisma.users.count();
    console.log(`✅ Users table: OK (${userCount} users found)`);
    
    // Test 3: Can read a user
    const firstUser = await prisma.users.findFirst();
    console.log('✅ Query test: OK');
    console.log('First user:', firstUser);
    
    console.log('\n✅ All tests passed!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();