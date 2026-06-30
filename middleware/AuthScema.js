const joi = require("joi");
const AppError = require("../utils/AppError");

const SignUpSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
});

const LoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
});

const ForgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

const VerifyOTPSchema = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().min(6).required(),
});

const ResetPasswordSchema = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().length(6).required(),
  newPassword: joi.string().min(6).max(30).required(),
});

const changePasswordSchema = joi.object({
  oldPassword: joi.string().required(),
  newPassword: joi.string().min(6).max(30).required(),
});

const verifyEmailSchema = joi.object({
  otp: joi.string().min(6).required(),
});

const SignUpValidation = (req, res, next) => {
  const { error } = SignUpSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

const LoginValidation = (req, res, next) => {
  const { error } = LoginSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

const ForgotPasswordValidation = (req, res, next) => {
  const { error } = ForgotPasswordSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};
const veriftOTPValidation = (req, res, next) => {
  const { error } = VerifyOTPSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};
const resetPasswordValidation = (req, res, next) => {
  const { error } = ResetPasswordSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

const changePasswordValidation = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

const verifyEmailValidation = (req, res, next) => {
  const { error } = verifyEmailSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

module.exports = {
  SignUpValidation,
  LoginValidation,
  ForgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyEmailValidation,
  veriftOTPValidation,
};
