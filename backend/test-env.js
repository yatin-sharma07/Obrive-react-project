// backend/test-env.js
// require('dotenv').config();

// console.log('Environment Variables Check:');
// console.log('==============================');
// console.log('PORT:', process.env.PORT);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
// console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');

// backend/test-env.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const { prisma } = require("./src/config/db");

async function createUser() {
  const [userid, email, name, role, password] = process.argv.slice(2);

  if (!userid || !email || !name || !role || !password) {
    console.log('Usage: node test-env.js <userid> <email> "<name>" <role> <password>');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: {
      userid,
      email,
      name,
      role,                 // e.g. "employee" / "client" / "HR" / "Admin"
      password: hashedPassword,
      status: "offline",    // optional (db default exists, but safe)
      isActive: true,       // optional (db default exists, but safe)
    },
  });

  console.log("Created:", { id: user.id, email: user.email, role: user.role });
}

createUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });