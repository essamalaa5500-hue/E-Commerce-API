const User = require("../models/users");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../config/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    "+resetPasswordOTP +resetPasswordOTPExpiry",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const otp = generateOTP();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetPasswordOTP = hashedOTP;
  user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `
      <h2>Password Reset Code</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email }).select(
    "+password +resetPasswordOTP +resetPasswordOTPExpiry +refreshToken",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  if (user.resetPasswordOTP !== hashedOTP) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (user.resetPasswordOTPExpiry < Date.now()) {
    return next(new AppError("OTP expired", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpiry = undefined;
  user.refreshToken = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select(
    "+password +refreshToken",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.refreshToken = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const sendVerifyEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "+EmailVerifiedOTP +EmailVerifiedExpiry",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError("Email already verified", 400));
  }

  const otp = generateOTP();

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  user.EmailVerifiedOTP = hashedOTP;
  user.EmailVerifiedExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  res.status(200).json({
    success: true,
    message: "Verification OTP sent successfully",
  });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;

  const user = await User.findById(req.user._id).select(
    "+EmailVerifiedOTP +EmailVerifiedExpiry",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError("Email already verified", 400));
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

  if (user.EmailVerifiedOTP !== hashedOTP) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (user.EmailVerifiedExpiry < Date.now()) {
    return next(new AppError("OTP expired", 400));
  }

  user.isEmailVerified = true;
  user.EmailVerifiedOTP = undefined;
  user.EmailVerifiedExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

module.exports = {
  forgotPassword,
  resetPassword,
  changePassword,
  sendVerifyEmail,
  verifyEmail,
};
