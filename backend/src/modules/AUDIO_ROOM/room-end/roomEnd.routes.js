const express =
  require("express");

const router =
  express.Router();

const { endRoomController,} = require( "./roomEnd.controller");

const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { RoomEndBodySchema } = require("./roomEnd.validation");

router.post(
  "/end-room",
  auth,
  requireRoomRoles(["host", "admin"]),
  zodValidate({ part: "body", schema: RoomEndBodySchema }),
  endRoomController
);

module.exports =
  router;
