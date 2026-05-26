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

router.post(
  "/raise-hand",
  auth,
  raiseHandController
);

module.exports =
  router;
