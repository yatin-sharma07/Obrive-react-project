const router = require("express").Router();
const controller = require("./auth.controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/auth");
const { body } = require("express-validator");

// EMPLOYEE LOGIN (Employee + HR + Admin)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),

    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  controller.loginUser,
);

// CLIENT LOGIN
router.post(
  "/client/login",
  [
    body("email") // ✅ FIXED (was clientId)
      .isEmail()
      .withMessage("Valid email required"),

    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  controller.loginClient,
);

// LOGOUT (requires cookie auth)
router.post(
  "/logout",
  authenticate, // reads cookie (accessToken)
  controller.logout,
);

//  REFRESH TOKEN (uses cookie)
router.post("/refresh", controller.refreshToken);

module.exports = router;
