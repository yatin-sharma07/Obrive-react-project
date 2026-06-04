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
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { RoomStartBodySchema } = require("./roomStart.validation");

router.post(
  "/start-room",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "body", schema: RoomStartBodySchema }),
  startRoomController
);

module.exports =
  router;
