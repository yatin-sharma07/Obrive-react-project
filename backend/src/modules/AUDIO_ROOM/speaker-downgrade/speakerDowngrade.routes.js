const express =
  require("express");

const router =
  express.Router();

const {
  downgradeToListenerController,
} = require(
  "./speakerDowngrade.controller"
);

router.post(
  "/downgrade-speaker",
  downgradeToListenerController
);

module.exports = router;
