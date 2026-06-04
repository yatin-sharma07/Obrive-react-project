const express =
  require("express");

const router =
  express.Router();

const {
  raiseHandController,
} = require(
  "./roomRaiseHand.controller"
);
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { RoomRaiseHandBodySchema } = require("./roomRaiseHand.validation");

router.post(
  "/raise-hand",
  auth,
  zodValidate({ part: "body", schema: RoomRaiseHandBodySchema }),
  raiseHandController
);

module.exports =
  router;
