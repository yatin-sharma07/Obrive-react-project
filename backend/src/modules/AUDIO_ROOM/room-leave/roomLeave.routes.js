const express =
  require("express");

const router =
  express.Router();

const {
  leaveRoomController,
} = require(
  "./roomLeave.controller"
);

router.post(
  "/leave-room",
  leaveRoomController
);

module.exports =
  router;