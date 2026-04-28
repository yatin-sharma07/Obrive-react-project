require('dotenv').config();
const bcrypt = require('bcrypt');
const { prisma } = require('./src/config/db');

async function resetEmployee() {
  try {
    const hash = await bcrypt.hash('12345', 10);
    console.log('🔑 Password hashed...');

    await prisma.$executeRaw`
      UPDATE users
      SET password   = ${hash},
          status     = 'online',
          updated_at = NOW()
      WHERE email = 'karn@obrive.com' AND role = 'employee'
    `;

    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status FROM users WHERE email = 'karn@obrive.com'
    `;

    console.log('\n✅ Employee updated:');
    console.table(result);
    console.log('\n🔐 Use these credentials to login:');
    console.log('   Email   : karn@obrive.com');
    console.log('   Password: 12345');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetEmployee();
