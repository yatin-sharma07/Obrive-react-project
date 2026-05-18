const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking and fixing room_configs table...");
    
    // Safely add missing columns one by one. If they already exist, it will just log an error and continue.
    const queries = [
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "roomName" VARCHAR(100);`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "roomDescription" TEXT;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "roomType" VARCHAR(50);`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "roomStatus" VARCHAR(50) DEFAULT 'scheduled';`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "startTime" TIMESTAMP(3);`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "participantLimit" INTEGER;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "visibility" VARCHAR(50);`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "whoCanHost" JSONB;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "whoCanModerate" JSONB;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "whoCanSpeak" JSONB;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "whoCanJoin" JSONB;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "allowGuestUsers" BOOLEAN DEFAULT false;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "notificationSettings" JSONB;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "createdBy" INTEGER;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "endedBy" INTEGER;`,
      `ALTER TABLE "room_configs" ADD COLUMN IF NOT EXISTS "endedAt" TIMESTAMP(3);`
    ];

    for (const query of queries) {
      try {
        await prisma.$executeRawUnsafe(query);
        console.log(`✅ Executed: ${query.split('ADD COLUMN IF NOT EXISTS ')[1]}`);
      } catch (e) {
        console.log(`Column might already exist or error:`, e.message);
      }
    }

    console.log("Finished safely updating the room_configs table.");
  } catch (error) {
    console.error("Critical error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();