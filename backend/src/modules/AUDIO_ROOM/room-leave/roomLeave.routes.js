const express =
  require("express");

const router =
  express.Router();

const {
  leaveRoomController,
} = require(
  "./roomLeave.controller"
);
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { RoomLeaveBodySchema } = require("./roomLeave.validation");

router.post(
  "/leave-room",
  auth,
  zodValidate({ part: "body", schema: RoomLeaveBodySchema }),
  leaveRoomController
);

module.exports =
  router;
