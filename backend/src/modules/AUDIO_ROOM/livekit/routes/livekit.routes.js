const express = require("express");
const auth = require("../../../../middleware/auth");
const {
  createLiveKitTokenController,
} = require("../controllers/livekit.controller");

const router = express.Router();

router.post("/livekit/token", auth, createLiveKitTokenController);

module.exports = router;
