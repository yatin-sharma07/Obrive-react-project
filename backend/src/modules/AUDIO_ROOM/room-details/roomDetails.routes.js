const express =
  require("express");

const router =
  express.Router();

const {
  getRoomDetailsController,
} = require(
  "./roomDetails.controller"
);

router.get(
  "/room-details/:roomId",
  getRoomDetailsController
);

module.exports =
  router;