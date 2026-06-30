const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
  changePassword,
  sendVerifyEmail,
  verifyEmail,
} = require("../controllers/passwordController");

const {
  ForgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyEmailValidation,
} = require("../../middleware/AuthScema");
const verifyToken = require("../../middleware/verifyToken");

router.post("/forgot-password", ForgotPasswordValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);

router.patch(
  "/change-password",
  verifyToken,
  changePasswordValidation,
  changePassword,
);
router.patch("/send-verify-email", verifyToken, sendVerifyEmail);
router.patch("/verify-email", verifyToken, verifyEmailValidation, verifyEmail);

module.exports = router;
