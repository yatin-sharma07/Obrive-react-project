// backend/src/modules/chat/chat.service.js
const { prisma } = require("../../../prisma");

exports.getConversationById = async (conversationId, userId) => {
  const result = await prisma.$queryRaw`
    SELECT 
      c.id, 
      c.type, 
      c.name, 
      c.created_by,
      c.created_at,
      (
        SELECT json_build_object(
          'content', m.content,
          'created_at', m.created_at,
          'sender_id', m.sender_id,
          'type', m.type
        )
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message,
      (
        SELECT cu.unread_count
        FROM conversation_unread cu
        WHERE cu.conversation_id = c.id AND cu.user_id = ${userId}
      ) as unread_count,
      (
        SELECT json_agg(json_build_object(
          'id', u.id,
          'name', u.name,
          'status', u.status,
          'job_title', u.job_title,
          'is_admin', (u.id = c.created_by)
        ))
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = c.id
      ) as participants
    FROM conversations c
    WHERE c.id = ${parseInt(conversationId)}
    LIMIT 1
  `;
  return result[0];
};

exports.getConversations = async (userId) => {
  // Get all conversations where the user is a participant and not hidden
  const result = await prisma.$queryRaw`
    SELECT 
      c.id, 
      c.type, 
      c.name, 
      c.created_by,
      c.created_at,
      (
        SELECT json_build_object(
          'content', m.content,
          'created_at', m.created_at,
          'sender_id', m.sender_id,
          'type', m.type
        )
        FROM messages m
        WHERE m.conversation_id = c.id
        AND (cp_main.deleted_until IS NULL OR m.created_at > cp_main.deleted_until)
        ORDER BY m.created_at DESC
        LIMIT 1
      ) as last_message,
      (
        SELECT cu.unread_count
        FROM conversation_unread cu
        WHERE cu.conversation_id = c.id AND cu.user_id = ${userId}
      ) as unread_count,
      (
        SELECT json_agg(json_build_object(
          'id', u.id,
          'name', u.name,
          'status', u.status,
          'job_title', u.job_title,
          'is_admin', (u.id = c.created_by)
        ))
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = c.id
      ) as participants
    FROM conversations c
    JOIN conversation_participants cp_main ON c.id = cp_main.conversation_id
    WHERE cp_main.user_id = ${userId}
    AND cp_main.is_hidden = false
    ORDER BY (
      SELECT m.created_at 
      FROM messages m 
      WHERE m.conversation_id = c.id 
      ORDER BY m.created_at DESC 
      LIMIT 1
    ) DESC NULLS LAST, c.created_at DESC
  `;

  return result;
};

exports.getMessages = async (conversationId, userId, page = 1, limit = 50) => {
  const offset = (page - 1) * limit;

  // Verify participant
  const cp = await prisma.conversation_participants.findFirst({
    where: { conversation_id: parseInt(conversationId), user_id: userId }
  });

  if (!cp) {
    throw { status: 403, message: "Not a participant of this conversation" };
  }

  const result = await prisma.$queryRaw`
    SELECT 
      m.id::text, 
      m.content, 
      m.created_at, 
      m.sender_id,
      m.is_edited,
      m.type,
      u.name as sender_name
    FROM messages m
    LEFT JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ${parseInt(conversationId)}
    AND (${cp.deleted_until}::timestamp IS NULL OR m.created_at > ${cp.deleted_until}::timestamp)
    ORDER BY m.created_at DESC
    LIMIT ${parseInt(limit)}
    OFFSET ${parseInt(offset)}
  `;

  return result.reverse(); // Newest messages last for the UI
};

exports.createConversation = async (userId, { type, name, participantIds }) => {
  // Add creator to participants
  const allParticipantIds = Array.from(new Set([...participantIds, userId]));

  if (type === 'direct' && allParticipantIds.length !== 2) {
    throw { status: 400, message: "Direct chat must have exactly 2 participants" };
  }

  // For direct chats, check if it already exists
  if (type === 'direct') {
    const existing = await prisma.$queryRaw`
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
      JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
      WHERE c.type = 'direct'
      AND cp1.user_id = ${allParticipantIds[0]}
      AND cp2.user_id = ${allParticipantIds[1]}
      LIMIT 1
    `;
    if (existing[0]) {
      // Unhide for the creator if it was hidden
      await prisma.conversation_participants.update({
        where: {
          conversation_id_user_id: {
            conversation_id: existing[0].id,
            user_id: userId
          }
        },
        data: { is_hidden: false }
      });
      
      // Fetch full formatted object
      const formatted = await this.getConversationById(existing[0].id, userId);
      return formatted;
    }
  }

  const conversation = await prisma.conversations.create({
    data: {
      type,
      name: type === 'group' ? name : null,
      created_by: userId,
      participants: {
        create: allParticipantIds.map(id => ({ user_id: parseInt(id) }))
      }
    },
    include: {
      participants: {
        include: {
          user: {
            select: { id: true, name: true, status: true, job_title: true }
          }
        }
      }
    }
  });

  // Initialize unread counts
  await prisma.conversation_unread.createMany({
    data: allParticipantIds.map(id => ({
      user_id: parseInt(id),
      conversation_id: conversation.id,
      unread_count: 0
    }))
  });

  return await this.getConversationById(conversation.id, userId);
};

exports.addParticipants = async (conversationId, adminId, participantIds) => {
  const conversation = await prisma.conversations.findUnique({
    where: { id: parseInt(conversationId) }
  });

  if (!conversation || conversation.type !== 'group') {
    throw { status: 400, message: "Not a group conversation" };
  }

  if (conversation.created_by !== adminId) {
    throw { status: 403, message: "Only group admin can add people" };
  }

  const newParticipants = participantIds.map(id => ({
    conversation_id: parseInt(conversationId),
    user_id: parseInt(id)
  }));

  await prisma.conversation_participants.createMany({
    data: newParticipants,
    skipDuplicates: true
  });

  await prisma.conversation_unread.createMany({
    data: participantIds.map(id => ({
      user_id: parseInt(id),
      conversation_id: parseInt(conversationId),
      unread_count: 0
    })),
    skipDuplicates: true
  });

  return { message: "Participants added successfully" };
};

exports.removeParticipant = async (conversationId, adminId, userIdToRemove) => {
  const conversation = await prisma.conversations.findUnique({
    where: { id: parseInt(conversationId) }
  });

  if (!conversation || conversation.type !== 'group') {
    throw { status: 400, message: "Not a group conversation" };
  }

  if (conversation.created_by !== adminId) {
    throw { status: 403, message: "Only group admin can remove people" };
  }

  if (userIdToRemove === adminId) {
    throw { status: 400, message: "Admin cannot be removed" };
  }

  const userToRemove = await prisma.users.findUnique({ where: { id: parseInt(userIdToRemove) } });

  await prisma.conversation_participants.delete({
    where: {
      conversation_id_user_id: {
        conversation_id: parseInt(conversationId),
        user_id: parseInt(userIdToRemove)
      }
    }
  });

  await prisma.conversation_unread.deleteMany({
    where: {
      conversation_id: parseInt(conversationId),
      user_id: parseInt(userIdToRemove)
    }
  });

  // Create system message
  const systemMessage = await prisma.messages.create({
    data: {
      conversation_id: parseInt(conversationId),
      content: `${userToRemove?.name || 'User'} was removed from the group`,
      type: 'system'
    }
  });

  return { 
    message: "Participant removed successfully",
    systemMessage: {
      ...systemMessage,
      id: systemMessage.id.toString(),
      sender_name: 'System'
    }
  };
};

exports.deleteConversation = async (conversationId, userId, type) => {
  const conversation = await prisma.conversations.findUnique({
    where: { id: parseInt(conversationId) }
  });

  if (!conversation) throw { status: 404, message: "Conversation not found" };

  if (type === 'permanent') {
    // Only admin can delete permanently
    if (conversation.created_by !== userId) {
      throw { status: 403, message: "Only group creator can delete permanently" };
    }

    await prisma.conversations.delete({
      where: { id: parseInt(conversationId) }
    });
    return { message: "Conversation deleted for everyone" };
  } else {
    // Delete for self (hide and clear history for self)
    await prisma.conversation_participants.update({
      where: {
        conversation_id_user_id: {
          conversation_id: parseInt(conversationId),
          user_id: userId
        }
      },
      data: {
        is_hidden: true,
        deleted_until: new Date()
      }
    });
    return { message: "Conversation deleted from your end" };
  }
};

exports.markAsRead = async (conversationId, userId) => {
  await prisma.conversation_unread.update({
    where: {
      user_id_conversation_id: {
        user_id: userId,
        conversation_id: parseInt(conversationId)
      }
    },
    data: { unread_count: 0 }
  });

  return { success: true };
};

exports.seedDummyChats = async (userId) => {
  // Find Karn and Yatin
  const dummyUsers = await prisma.users.findMany({
    where: {
      name: { in: ['Karn', 'Yatin'] }
    }
  });

  if (dummyUsers.length === 0) {
    // If not found, create them
    const karn = await prisma.users.create({
      data: {
        userid: 'karn_dummy',
        email: 'karn@obrive.com',
        name: 'Karn',
        role: 'employee',
        password: 'dummy_password',
        status: 'online',
        updated_at: new Date(),
        job_title: 'Developer'
      }
    });
    const yatin = await prisma.users.create({
      data: {
        userid: 'yatin_dummy',
        email: 'yatin@obrive.com',
        name: 'Yatin',
        role: 'employee',
        password: 'dummy_password',
        status: 'online',
        updated_at: new Date(),
        job_title: 'Designer'
      }
    });
    dummyUsers.push(karn, yatin);
  }

  // Create group with them
  const group = await this.createConversation(userId, {
    type: 'group',
    name: 'Obrive Core Team',
    participantIds: dummyUsers.map(u => u.id)
  });

  // Create direct chats with each
  const directChats = await Promise.all(dummyUsers.map(u => 
    this.createConversation(userId, {
      type: 'direct',
      participantIds: [u.id]
    })
  ));

  return { group, directChats };
};
