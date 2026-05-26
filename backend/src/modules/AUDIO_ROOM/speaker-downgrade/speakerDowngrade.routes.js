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
const { requireRoomRoles } = require("../audioRoomAuthz");

router.post(
  "/downgrade-speaker",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  downgradeToListenerController
);

module.exports = router;
