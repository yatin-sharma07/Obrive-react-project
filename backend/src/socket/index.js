// backend/src/socket/index.js
const { Server } = require("socket.io");
const { socketAuthMiddleware } = require("./middleware/auth.middleware");
const { registerConnectionHandler } = require("./handlers/connection.handler");

let io;

exports.initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
