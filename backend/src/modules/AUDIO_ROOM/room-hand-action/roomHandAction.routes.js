const express =
  require("express");

const router =
  express.Router();

const {
  handleHandRequestActionController,
} = require("./roomHandAction.controller");

router.post(
  "/hand-action",
  handleHandRequestActionController
);

module.exports =
  router;
