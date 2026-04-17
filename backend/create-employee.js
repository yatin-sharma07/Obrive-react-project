require('dotenv').config();
const bcrypt = require('bcrypt');
const { prisma } = require('./src/config/db');

async function createEmployee() {
  try {
    const hash = await bcrypt.hash('12345', 10);
    console.log('🔑 Password hashed...');

    await prisma.$executeRaw`
      INSERT INTO users (email, name, role, password, status, userid, created_at, updated_at)
      VALUES (
        'employee1@example.com',
        'Employee One',
        'employee',
        ${hash},
        'online',
        ${'EMP' + Date.now()},
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        password   = ${hash},
        status     = 'online',
        role       = 'employee',
        updated_at = NOW()
    `;

    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status FROM users WHERE email = 'employee1@example.com'
    `;

    console.log('\n✅ Employee created/updated:');
    console.table(result);
    console.log('\n🔐 Login credentials:');
    console.log('   Email   : employee1@example.com');
    console.log('   Password: 12345');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

createEmployee();
