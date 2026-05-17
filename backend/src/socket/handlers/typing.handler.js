// backend/src/socket/handlers/typing.handler.js
exports.registerTypingHandler = (io, socket) => {
  socket.on("typing_start", (conversationId) => {
    socket.to(`conversation:${conversationId}`).emit("typing_started", {
      userId: socket.user.id,
      userName: socket.user.name,
      conversationId
    });
  });

  socket.on("typing_stop", (conversationId) => {
    socket.to(`conversation:${conversationId}`).emit("typing_stopped", {
      userId: socket.user.id,
      conversationId
    });
  });
};
