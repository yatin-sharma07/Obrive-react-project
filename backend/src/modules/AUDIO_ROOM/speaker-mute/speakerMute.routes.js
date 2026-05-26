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
const { requireRoomRoles } = require("../audioRoomAuthz");

router.post(
  "/mute-speaker",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  muteUnmuteController
);

router.post(
  "/unmute-speaker",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  muteUnmuteController
);

module.exports = router;
