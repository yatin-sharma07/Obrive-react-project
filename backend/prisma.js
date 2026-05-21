require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;

let prisma;

// Create Prisma client with retry logic
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
    errorFormat: 'pretty',
  });
};

// C:\practicals\next_js_projects\obrive\Obrive-react-project\backend\prisma.js

// Retry connection with exponential backoff
const connectWithRetry = async (maxRetries = 5) => {
  let retries = 0;
  let lastError;

  while (retries < maxRetries) {
    try {
      console.log(`🔄 Attempting database connection (attempt ${retries + 1}/${maxRetries})...`);
      await prisma.$connect();
      console.log('✅ Successfully connected to database');
      return true;
    } catch (error) {
      lastError = error;
      retries++;
      
      if (retries < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retries - 1), 10000); // Max 10 seconds
        console.warn(`⏳ Connection failed. Retrying in ${delay}ms... Error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('❌ Failed to connect to database after all retries');
  throw lastError;
};

// Initialize or reuse existing client
try {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  prisma = globalForPrisma.prisma;
} catch (error) {
  console.error('Failed to create Prisma client:', error.message);
  console.error('Full error:', error);
  console.error('Stack:', error.stack);
  throw error;
}

// Handle graceful disconnection with retry
const disconnectDB = async () => {
  try {
    if (prisma) {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

// Register disconnect handlers
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await disconnectDB();
  process.exit(1);
});

module.exports = { prisma, connectWithRetry };
