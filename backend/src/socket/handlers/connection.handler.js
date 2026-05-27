// backend/src/socket/handlers/connection.handler.js
const { registerMessageHandler } = require("./message.handler");
const { registerTypingHandler } = require("./typing.handler");
const { registerPresenceHandler } = require("./presence.handler");
const { joinConversationRoom, leaveConversationRoom } = require("../room/room.manager");
const { registerAudioRoomHandler,} = require("./audioRoom.Handler");  //AR
const { registerModerationHandler } = require("./moderation.handler"); //AR

exports.registerConnectionHandler = (io, socket) => {
  console.log(`User connected ${socket.user?.id}`);
  
  // Join personal room for notifications
  socket.join(`user:${socket.user.id}`);

  registerPresenceHandler(io, socket);
  registerMessageHandler(io, socket);
  registerTypingHandler(io, socket);
  registerAudioRoomHandler(io, socket); //AR
  registerModerationHandler(io, socket); //AR

  socket.on("join_conversation", (conversationId) => {
    joinConversationRoom(socket, conversationId);
  });

  socket.on("leave_conversation", (conversationId) => {
    leaveConversationRoom(socket, conversationId);
  });
};
