const express =
  require("express");

const router =
  express.Router();

const {
  startRoomController,
} = require(
  "./roomStart.controller"
);

router.post(
  "/start-room",
  startRoomController
);

module.exports =
  router;