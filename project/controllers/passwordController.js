const User = require("../models/users");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../config/sendEmail");
const bcrypt = require("bcrypt");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpiry = expiry;
  await user.save({ validateBeforeSave: false });
  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: `
        <h2>Password Reset Code</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
  });
  res.status(200).json({ message: "OTP sent successfully" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return next(new AppError("invalid request", 400));
  }
  const user = await User.findOne({ email }).select(
    "+resetPasswordOTP +resetPasswordOTPExpiry +password",
  );
  if (!user) return next(new AppError("User not found", 404));
  if (user.resetPasswordOTP !== otp)
    return next(new AppError("Invalid OTP", 400));
  if (user.resetPasswordOTPExpiry < Date.now())
    return next(new AppError("OTP expired", 400));
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ message: "Password reset successfully" });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return next(new AppError("User not found", 404));
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return next(new AppError("Invalid password", 400));
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ message: "Password changed successfully" });
});

const sendVerifyEmail = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.isEmailVerified)
    return next(new AppError("User already verified", 400));

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 1);
  user.EmailVerifiedOTP = otp;
  user.EmailVerifiedExpiry = expiry;
  await user.save({ validateBeforeSave: false });
  await sendEmail({
    to: user.email,
    subject: "Email Verification",
    html: `
        <h2>Email Verification Code</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `,
  });
  res.status(200).json({ message: "OTP sent successfully" });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;

  const user = await User.findOne({ email }).select(
    "+emailVerifiedOTP +EmailVerifiedExpiry",
  );
  if (user.isEmailVerified) {
    return next(new AppError("User already verified", 400));
  }
  if (user.EmailVerifiedOTP !== otp)
    return next(new AppError("Invalid OTP", 400));
  if (user.EmailVerifiedOTPExpiry < Date.now())
    return next(new AppError("OTP expired", 400));
  user.isEmailVerified = true;
  user.EmailVerifiedOTP = undefined;
  user.EmailVerifiedOTPExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ message: "Email verified successfully" });
});

module.exports = {
  forgotPassword,
  resetPassword,
  changePassword,
  sendVerifyEmail,
  verifyEmail,
};
