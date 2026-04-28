require('dotenv').config();
const { prisma } = require('./src/config/db');

async function check() {
  try {
    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, 
             LEFT(password, 10) as pw_preview 
      FROM users 
      WHERE email = 'employee1@example.com' 
      LIMIT 1
    `;
    console.log('Target user:', JSON.stringify(result, null, 2));

    const all = await prisma.$queryRaw`
      SELECT id, email, role, status, LEFT(password, 10) as pw_preview 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    console.log('\nAll recent users:', JSON.stringify(all, null, 2));
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
