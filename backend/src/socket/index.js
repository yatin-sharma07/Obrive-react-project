// backend/src/socket/index.js
const { Server } = require("socket.io");
const { socketAuthMiddleware } = require("./middleware/auth.middleware");
const { registerConnectionHandler } = require("./handlers/connection.handler");

let io;

exports.initializeSocket = (httpServer) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ].filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerConnectionHandler(io, socket);
  });

  return io;
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
