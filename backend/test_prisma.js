const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const res = await prisma.room_configs.findFirst();
    console.log("Success! Result:", res);
  } catch(e) {
    console.error("Error from Prisma:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();