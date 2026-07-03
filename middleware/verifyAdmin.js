const User = require("../src/models/users");
const AppError = require("../utils/AppError");

const verifyAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new AppError("You are not authorized to access this route", 401),
    );
  }
  next();
};

module.exports = verifyAdmin;
