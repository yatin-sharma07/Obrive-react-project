/**
 * ROOM CONFIG SERVICE
 * 
 * Business logic layer: Takes validated data from controller and saves to database
 */

// Import Prisma - try the config file first, fallback to direct PrismaClient
let prisma;
try {
  const dbConfig = require('../../../config/db');
  prisma = dbConfig.prisma;
  console.log("✅ Prisma imported from config/db.js");
} catch (err) {
  console.error("⚠️ Failed to import from config/db.js, using PrismaClient directly:", err.message);
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
}

// Verify prisma is available
if (!prisma) {
  throw new Error("❌ CRITICAL: Prisma client initialization failed!");
}

// Verify room_configs model exists
if (!prisma.room_configs) {
  console.error("❌ prisma.room_configs is undefined. Available models:", Object.keys(prisma));
  throw new Error("room_configs model not found in Prisma client. Try running: npx prisma generate");
}

/**
 * CREATE ROOM CONFIG SERVICE
 * @param {Object} roomData - Validated room configuration data
 * @returns {Object} - Saved room config object from database
 * 
 * FLOW:
 * 1. Data arrives already validated from controller
 * 2. Call prisma.room_configs.create() to save to database
 * 3. Return saved object (includes auto-generated ID, timestamps)
 */
const createRoomConfigService = async (roomData) => {
  try {
    console.log("📝 Saving room config to database...");
    console.log("Input data:", JSON.stringify(roomData, null, 2));

    // SAVE TO DATABASE using Prisma
    console.log("🔄 Calling prisma.room_configs.create()...");
    
    const savedRoom = await prisma.room_configs.create({
      data: {
        roomName: roomData.roomName,
        roomDescription: roomData.roomDescription || null,
        roomType: roomData.roomType,
        startTime: roomData.startTime ? new Date(roomData.startTime) : null,
        participantLimit: roomData.participantLimit,
        visibility: roomData.visibility,
        whoCanHost: roomData.whoCanHost || [],
        whoCanModerate: roomData.whoCanModerate || [],
        whoCanSpeak: roomData.whoCanSpeak || [],
        whoCanJoin: roomData.whoCanJoin || [],
        allowGuestUsers: roomData.allowGuestUsers,
      },
    });

    console.log("✅ Room saved successfully!");
    console.log("Saved room:", JSON.stringify(savedRoom, null, 2));
    return savedRoom;
  } catch (error) {
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = {
  createRoomConfigService,
};