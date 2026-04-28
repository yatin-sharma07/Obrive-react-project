// backend/diagnose-user.js
require('dotenv').config();
const { prisma } = require('./src/config/db');

async function check() {
  try {
    const user = await prisma.$queryRaw`
      SELECT id, email, role, 
             password as pw_first_20,
             LENGTH(password) as pw_length,
             SUBSTRING(password, 1, 20) as pw_start
      FROM users 
      WHERE email = 'karnhr@obrive.com'
    `;
    
    console.log('User:', JSON.stringify(user, null, 2));
    
    // Compare: bcrypt hashes start with $2b$, $2a$, or $2y$
    if (user[0]) {
      const pw = user[0].pw_first_20;
      const isHashed = pw.startsWith('$2b$') || pw.startsWith('$2a$') || pw.startsWith('$2y$');
      console.log('\n✓ Password format:', isHashed ? 'BCRYPT HASH (✓ Good)' : 'PLAIN TEXT (✗ Problem!)');
    }
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();