const express =
  require("express");

const router =
  express.Router();

const {
  removeParticipantController,
} = require(
  "./participantRemove.controller"
);

router.post(
  "/remove-participant",
  removeParticipantController
);

module.exports = router;
