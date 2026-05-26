const express =
  require("express");

const router =
  express.Router();

const {
  endRoomController,
} = require(
  "./roomEnd.controller"
);

const auth = require("../../../middleware/auth");
const { requireRoomRoles } = require("../audioRoomAuthz");

router.post(
  "/end-room",
  auth,
  requireRoomRoles(["host", "admin"]),
  endRoomController
);

module.exports =
  router;
