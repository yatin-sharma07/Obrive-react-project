const express =
  require("express");

const router =
  express.Router();

const {
  getPendingHandRequestsController,
} = require("./roomHandRequests.controller");

router.get(
  "/hand-requests/:roomId",
  getPendingHandRequestsController
);

module.exports =
  router;
