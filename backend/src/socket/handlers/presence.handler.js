// backend/src/socket/handlers/presence.handler.js
const { addOnlineUser, removeOnlineUser } = require("../store/onlineUsers");

exports.registerPresenceHandler = (io, socket) => {
  addOnlineUser(socket.user.id, socket.id);

  io.emit("user_online", {
    userId: socket.user.id,
  });

  socket.on("disconnect", () => {
    removeOnlineUser(socket.user.id);

    io.emit("user_offline", {
      userId: socket.user.id,
    });
  });
};
