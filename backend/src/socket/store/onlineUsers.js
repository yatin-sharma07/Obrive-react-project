// backend/src/socket/store/onlineUsers.js
const onlineUsers = new Map(); // userId -> Set of socketIds

exports.addOnlineUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
};

exports.removeOnlineUser = (userId, socketId) => {
  if (onlineUsers.has(userId)) {
    const sockets = onlineUsers.get(userId);
    sockets.delete(socketId);
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
    }
  }
};

exports.getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

exports.isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};
