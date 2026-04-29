require('dotenv').config();
const bcrypt = require('bcrypt');
const { prisma } = require('./src/config/db');

async function testSupervisorLogin() {
  try {
    console.log('🔍 Testing Supervisor Login...\n');
    
    // Check if supervisor exists
    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, password, status 
      FROM users 
      WHERE email = 'supervisor@obrive.com'
      LIMIT 1
    `;
    
    const supervisor = result[0];
    
    if (!supervisor) {
      console.log('❌ Supervisor not found in database');
      return;
    }
    
    console.log('✅ Supervisor found:');
    console.log(`   ID: ${supervisor.id}`);
    console.log(`   Email: ${supervisor.email}`);
    console.log(`   Name: ${supervisor.name}`);
    console.log(`   Role: ${supervisor.role}`);
    console.log(`   Status: ${supervisor.status}`);
    
    // Test password
    const isValidPassword = await bcrypt.compare('12345', supervisor.password);
    console.log(`\n✅ Password verification: ${isValidPassword ? 'PASSED' : 'FAILED'}`);
    
    if (isValidPassword) {
      console.log('\n✅ Login simulation successful!');
      console.log('   The supervisor can now login with:');
      console.log('   Email: supervisor@obrive.com');
      console.log('   Password: 12345');
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSupervisorLogin();
