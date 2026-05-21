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

router.post(
  "/end-room",
  // auth,
  endRoomController
);

module.exports =
  router;