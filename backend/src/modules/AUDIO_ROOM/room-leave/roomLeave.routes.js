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

router.post(
  "/leave-room",
  auth,
  leaveRoomController
);

module.exports =
  router;
