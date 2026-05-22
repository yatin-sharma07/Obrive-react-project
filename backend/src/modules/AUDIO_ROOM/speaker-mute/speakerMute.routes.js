const express =
  require("express");

const router =
  express.Router();

const {
  muteUnmuteController,
} = require(
  "./speakerMute.controller"
);

router.post(
  "/mute-speaker",
  muteUnmuteController
);

router.post(
  "/unmute-speaker",
  muteUnmuteController
);

module.exports = router;
