const { prisma } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('Test@1234', 10);

    const user = await prisma.users.upsert({
      where: { email: 'testprofile@obrive.com' },
      update: {
        name: 'Test Profile',
        role: 'employee',
        password: hashedPassword,
        status: 'online',
      },
      create: {
        userid: 'testprof' + Date.now(),
        email: 'testprofile@obrive.com',
        name: 'Test Profile',
        role: 'employee',
        password: hashedPassword,
        status: 'online',
        updated_at: new Date(),
      },
    });

    console.log('✅ Test user created:', user.email);
    console.log('Email:', user.email);
    console.log('Password: Test@1234');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
