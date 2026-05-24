const express =
  require("express");

const router =
  express.Router();

const {
  getRoomDetailsController,
} = require(
  "./roomDetails.controller"
);
const auth = require("../../../middleware/auth");

router.get(
  "/room-details/:roomId",
  auth,
  getRoomDetailsController
);

module.exports =
  router;
