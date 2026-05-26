const express =
  require("express");

const router =
  express.Router();

const {
  removeParticipantController,
} = require(
  "./participantRemove.controller"
);
const auth = require("../../../middleware/auth");
const { requireRoomRoles } = require("../audioRoomAuthz");

router.post(
  "/remove-participant",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  removeParticipantController
);

module.exports = router;
