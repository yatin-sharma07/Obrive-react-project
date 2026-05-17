// backend/src/modules/chat/chat.routes.js
const express = require("express");
const router = express.Router();
const chatController = require("./chat.controller");
const authenticate = require("../../middleware/auth");

router.use(authenticate);

router.get("/conversations", chatController.getConversations);
router.get("/conversations/:conversationId/messages", chatController.getMessages);
router.post("/conversations", chatController.createConversation);
router.post("/conversations/:conversationId/participants", chatController.addParticipants);
router.delete("/conversations/:conversationId/participants/:userId", chatController.removeParticipant);
router.post("/conversations/:conversationId/read", chatController.markAsRead);
router.delete("/conversations/:conversationId", chatController.deleteConversation);
router.post("/seed-dummy", chatController.seedDummyChats);

module.exports = router;
