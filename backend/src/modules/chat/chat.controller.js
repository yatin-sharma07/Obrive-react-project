const chatService = require("./chat.service");
const { successResponse, errorResponse } = require("../../utils/apiResponse");
const { getIO } = require("../../socket");

exports.getConversations = async (req, res, next) => {
  try {
    const data = await chatService.getConversations(req.user.id);
    return successResponse(res, data, "Conversations fetched");
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page, limit } = req.query;
    const data = await chatService.getMessages(conversationId, req.user.id, page, limit);
    return successResponse(res, data, "Messages fetched");
  } catch (error) {
    next(error);
  }
};

exports.createConversation = async (req, res, next) => {
  try {
    const data = await chatService.createConversation(req.user.id, req.body);
    return successResponse(res, data, "Conversation created");
  } catch (error) {
    next(error);
  }
};

exports.addParticipants = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { participantIds } = req.body;
    const data = await chatService.addParticipants(conversationId, req.user.id, participantIds);
    return successResponse(res, data, "Participants added");
  } catch (error) {
    next(error);
  }
};

exports.removeParticipant = async (req, res, next) => {
  try {
    const { conversationId, userId } = req.params;
    const data = await chatService.removeParticipant(conversationId, req.user.id, userId);
    
    // Emit system message via socket
    if (data.systemMessage) {
      const io = getIO();
      io.to(`conversation:${conversationId}`).emit("message_received", {
        ...data.systemMessage,
        conversation_id: parseInt(conversationId)
      });
      
      // Also notify the removed user to leave the room (if they are connected)
      io.to(`user:${userId}`).emit("removed_from_group", { conversationId });
    }

    return successResponse(res, data, "Participant removed");
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const data = await chatService.markAsRead(conversationId, req.user.id);
    return successResponse(res, data, "Marked as read");
  } catch (error) {
    next(error);
  }
};

exports.deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { type } = req.query; // 'self' or 'permanent'
    const data = await chatService.deleteConversation(conversationId, req.user.id, type);
    return successResponse(res, data, "Conversation deleted");
  } catch (error) {
    next(error);
  }
};

exports.seedDummyChats = async (req, res, next) => {
  try {
    const data = await chatService.seedDummyChats(req.user.id);
    return successResponse(res, data, "Dummy chats seeded");
  } catch (error) {
    next(error);
  }
};
