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
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { ParticipantRemoveBodySchema } = require("./participantRemove.validation");

router.post(
  "/remove-participant",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "body", schema: ParticipantRemoveBodySchema }),
  removeParticipantController
);

module.exports = router;
