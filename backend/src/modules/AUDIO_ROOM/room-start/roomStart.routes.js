const express =
  require("express");

const router =
  express.Router();

const {
  startRoomController,
} = require(
  "./roomStart.controller"
);
const auth = require("../../../middleware/auth");
const { requireRoomRoles } = require("../audioRoomAuthz");

router.post(
  "/start-room",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  startRoomController
);

module.exports =
  router;
