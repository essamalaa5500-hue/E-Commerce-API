const jwt = require("jsonwebtoken");
const User = require("../src/models/users");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Invalid token", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return next(new AppError("Invalid token", 401));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("Invalid token", 401));
  }

  req.user = user;
  next();
});

module.exports = verifyToken;
