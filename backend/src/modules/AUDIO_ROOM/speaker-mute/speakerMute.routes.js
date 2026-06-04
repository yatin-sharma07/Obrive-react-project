const express =
  require("express");

const router =
  express.Router();

const {
  muteUnmuteController,
} = require(
  "./speakerMute.controller"
);
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { SpeakerMuteBodySchema } = require("./speakerMute.validation");

router.post(
  "/mute-speaker",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "body", schema: SpeakerMuteBodySchema }),
  muteUnmuteController
);

router.post(
  "/unmute-speaker",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "body", schema: SpeakerMuteBodySchema }),
  muteUnmuteController
);

module.exports = router;
