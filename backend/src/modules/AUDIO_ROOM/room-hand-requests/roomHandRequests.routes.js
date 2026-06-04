const express =
  require("express");

const router =
  express.Router();

const {
  getPendingHandRequestsController,
} = require("./roomHandRequests.controller");
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { RoomIdParamSchema } = require("./roomHandRequests.validation");

router.get(
  "/hand-requests/:roomId",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "params", schema: RoomIdParamSchema }),
  getPendingHandRequestsController
);

module.exports =
  router;
