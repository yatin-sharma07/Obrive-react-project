// backend/src/socket/store/messageQueue.js
const { prisma } = require("../../../prisma");

const messageQueue = [];

exports.queueMessage = (message) => {
  messageQueue.push(message);
};

setInterval(async () => {
  if (messageQueue.length === 0) return;

  const messagesToInsert = messageQueue.filter(msg => !isNaN(msg.conversation_id));
  messageQueue.length = 0;

  if (messagesToInsert.length === 0) return;

  try {
    // 1. Batch insert messages
    await prisma.messages.createMany({
      data: messagesToInsert,
    });

    // 2. Update unread counts for all participants EXCEPT the sender
    // For scalability, we group by conversation and sender
    const updates = messagesToInsert.reduce((acc, msg) => {
      if (!acc[msg.conversation_id]) acc[msg.conversation_id] = new Set();
      acc[msg.conversation_id].add(msg.sender_id);
      return acc;
    }, {});

    for (const [convId, senderIds] of Object.entries(updates)) {
      const conversationId = parseInt(convId);
      
      // Increment unread_count and UNHIDE for everyone in the conversation who is NOT the sender(s)
      await prisma.conversation_participants.updateMany({
        where: {
          conversation_id: conversationId,
          user_id: { notIn: Array.from(senderIds) }
        },
        data: {
          is_hidden: false
        }
      });

      await prisma.conversation_unread.updateMany({
        where: {
          conversation_id: conversationId,
          user_id: { notIn: Array.from(senderIds) }
        },
        data: {
          unread_count: { increment: 1 }
        }
      });
    }

    console.log(`Inserted ${messagesToInsert.length} messages and updated unread counts`);
  } catch (error) {
    console.error("Message batch insert or unread update failed", error);
  }
}, 3000);
