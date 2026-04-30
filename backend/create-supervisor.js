require('dotenv').config();
const bcrypt = require('bcrypt');
const { prisma } = require('./src/config/db');

async function createSupervisor() {
  try {
    const hash = await bcrypt.hash('12345', 10);
    console.log('🔑 Password hashed...');

    await prisma.$executeRaw`
      INSERT INTO users (email, name, role, password, status, userid, created_at, updated_at)
      VALUES (
        'supervisor@obrive.com',
        'Supervisor',
        'supervisor',
        ${hash},
        'online',
        ${'SUP' + Date.now()},
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        password   = ${hash},
        status     = 'online',
        role       = 'supervisor',
        updated_at = NOW()
    `;

    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status FROM users WHERE email = 'supervisor@obrive.com'
    `;

    console.log('\n✅ Supervisor created/updated:');
    console.table(result);
    console.log('\n🔐 Login credentials:');
    console.log('   Email   : supervisor@obrive.com');
    console.log('   Password: 12345');
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

createSupervisor();
