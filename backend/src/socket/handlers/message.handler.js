// backend/src/socket/handlers/message.handler.js
const { queueMessage } = require("../store/messageQueue");

exports.registerMessageHandler = (io, socket) => {
  socket.on("send_message", async (data) => {
    try {
      const { conversationId, content } = data;
      
      const convId = parseInt(conversationId);
      if (isNaN(convId)) {
        console.error("Invalid conversationId received:", conversationId);
        return;
      }

      const payload = {
        conversation_id: convId,
        sender_id: socket.user.id,
        content: content,
      };

      // Emit to everyone in the room
      io.to(`conversation:${convId}`).emit("message_received", {
        ...payload,
        sender_name: socket.user.name,
        created_at: new Date(),
      });

      // Also emit a notification event for all participants
      // (This can be used to show a toast or play a sound)
      socket.to(`conversation:${conversationId}`).emit("new_notification", {
        type: "message",
        conversationId,
        senderName: socket.user.name,
        content: content.substring(0, 50),
      });

      queueMessage(payload);
    } catch (error) {
      console.error("Message handler error:", error);
    }
  });
};
