const express = require("express");
const auth = require("../../../../middleware/auth");
const zodValidate = require("../../../../middleware/zodValidate");
const {
  createLiveKitTokenController,
} = require("../controllers/livekit.controller");
const { LiveKitTokenBodySchema } = require("../livekit.validation");

const router = express.Router();

router.post("/livekit/token", auth, zodValidate({ part: "body", schema: LiveKitTokenBodySchema }), createLiveKitTokenController);

module.exports = router;
