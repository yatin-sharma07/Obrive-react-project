const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.$queryRaw`
    SELECT userid, email, name, role, status 
    FROM users 
    WHERE role IN ('employee', 'hr') 
    ORDER BY role, status DESC
  `;
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
