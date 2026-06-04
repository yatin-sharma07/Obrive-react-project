const express =
  require("express");

const router =
  express.Router();

const {
  downgradeToListenerController,
} = require(
  "./speakerDowngrade.controller"
);
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { SpeakerDowngradeBodySchema } = require("./speakerDowngrade.validation");

router.post(
  "/downgrade-speaker",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "body", schema: SpeakerDowngradeBodySchema }),
  downgradeToListenerController
);

module.exports = router;
