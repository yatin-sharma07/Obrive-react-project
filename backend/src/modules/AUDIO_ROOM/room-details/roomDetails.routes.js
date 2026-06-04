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
const zodValidate = require("../../../middleware/zodValidate");
const { RoomIdParamSchema } = require("./roomDetails.validation");

router.get(
  "/room-details/:roomId",
  auth,
  zodValidate({ part: "params", schema: RoomIdParamSchema }),
  getRoomDetailsController
);

module.exports =
  router;
