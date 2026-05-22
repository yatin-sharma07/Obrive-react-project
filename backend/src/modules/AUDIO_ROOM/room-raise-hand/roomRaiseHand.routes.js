const express =
  require("express");

const router =
  express.Router();

const {
  raiseHandController,
} = require(
  "./roomRaiseHand.controller"
);

router.post(
  "/raise-hand",
  raiseHandController
);

module.exports =
  router;