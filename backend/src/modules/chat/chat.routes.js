// backend/src/modules/chat/chat.routes.js
const express = require("express");
const router = express.Router();
const chatController = require("./chat.controller");
const authenticate = require("../../middleware/auth");
const zodValidate = require("../../middleware/zodValidate");
const {
  AddParticipantsBodySchema,
  ConversationIdParamSchema,
  ConversationParticipantParamSchema,
  CreateConversationBodySchema,
  DeleteConversationQuerySchema,
  MessagesQuerySchema,
} = require("./chat.validation");

router.use(authenticate);

router.get("/conversations", chatController.getConversations);
router.get(
  "/conversations/:conversationId/messages",
  zodValidate({ part: "params", schema: ConversationIdParamSchema }),
  zodValidate({ part: "query", schema: MessagesQuerySchema }),
  chatController.getMessages
);
router.post("/conversations", zodValidate({ part: "body", schema: CreateConversationBodySchema }), chatController.createConversation);
router.post(
  "/conversations/:conversationId/participants",
  zodValidate({ part: "params", schema: ConversationIdParamSchema }),
  zodValidate({ part: "body", schema: AddParticipantsBodySchema }),
  chatController.addParticipants
);
router.delete(
  "/conversations/:conversationId/participants/:userId",
  zodValidate({ part: "params", schema: ConversationParticipantParamSchema }),
  chatController.removeParticipant
);
router.post("/conversations/:conversationId/read", zodValidate({ part: "params", schema: ConversationIdParamSchema }), chatController.markAsRead);
router.delete(
  "/conversations/:conversationId",
  zodValidate({ part: "params", schema: ConversationIdParamSchema }),
  zodValidate({ part: "query", schema: DeleteConversationQuerySchema }),
  chatController.deleteConversation
);
router.post("/seed-dummy", chatController.seedDummyChats);

module.exports = router;
