const express = require("express");
const {
  registerUser,
  verifyEmail,
  login,
  resendToken,
  resetPassword,
  verifyPasswordReset,
  confirmPasswordReset,
  sendOTP,
  ChangePassword,
} = require("../../controllers/authController");
const router = express.Router();
const { check } = require("express-validator");

router.route("/forget-password").post(sendOTP);
router.route("/change-password").post(ChangePassword);

router.post(
  "/register",
  [
    check("username", "Field is required").notEmpty(),
    check("phone", "Field is required").notEmpty(),
    check("email", "Field is required").notEmpty(),
    check("password", "Field is required")
      .trim()
      .notEmpty()
      .isStrongPassword()
      .withMessage(
        "Password must be at least 8 characters including a lowercase letter, an uppercase letter,a special symbol and a number"
      ),
  ],
  registerUser
);

router.route("/verify-email/:token").get(verifyEmail);
router.route("/reset-password-token").post(resetPassword);
router.route("/verify-password-reset/:token").get(verifyPasswordReset);
router
  .route("/password-reset/")
  .post(
    [
      check("password", "Field is required")
        .trim()
        .notEmpty()
        .isStrongPassword()
        .withMessage(
          "Password must be at least 8 characters including a lowercase letter, an uppercase letter,a special symbol and a number"
        ),
    ],
    confirmPasswordReset
  );
router.route("/resend-token/:email").get(resendToken);

router
  .route("/login")
  .post(
    [
      check("email", "Field is required").notEmpty(),
      check("password", "Field is required").notEmpty(),
    ],
    login
  );

module.exports = router;
