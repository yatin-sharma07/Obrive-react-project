// backend/src/socket/room/room.manager.js
exports.joinConversationRoom = (socket, conversationId) => {
  const roomId = `conversation:${conversationId}`;
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room ${roomId}`);
};

exports.leaveConversationRoom = (socket, conversationId) => {
  const roomId = `conversation:${conversationId}`;
  socket.leave(roomId);
  console.log(`Socket ${socket.id} left room ${roomId}`);
};
