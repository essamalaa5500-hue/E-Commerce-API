const User = require("../../project/models/users");
const AppError = require("../../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const SignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCreated = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  userCreated.password = undefined;
  res.json(userCreated);
});

const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(new AppError("Invalid email or password", 401));
  }
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
  await User.findByIdAndUpdate(user._id, { refreshToken });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  user.password = undefined;
  res.json({ accessToken, user });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(new AppError("Refresh token not found", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY);
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    return next(new AppError("Invalid refresh token", 401));
  }
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
  res.json({ accessToken });
});
const logout = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(new AppError("Refresh token not found", 401));
  }
  await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json("Logout Successfully");
});
const updateProfile = asyncHandler(async (req, res, next) => {
  const updates = {};
  if (req.body.name) {
    updates.name = req.body.name;
  }
  if (req.body.email) {
    updates.email = req.body.email;
  }
  if (req.body.phone) {
    updates.phone = req.body.phone;
  }
  const user = await User.findById(req.user._id).select(
    "+profileImagePublicId",
  );
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (req.file) {
    if (user.profileImagePublicId) {
      await cloudinary.v2.uploader.destroy(user.profileImagePublicId);
    }
    updates.profileImage = req.file.path;
    updates.profileImagePublicId = req.file.filename;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");
  res.json({
    message: `Profile updated successfully`,
    data: updatedUser,
  });

  return next(new AppError("Error occured while updating profile", 500));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.json(user);
});

const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.json(user);
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("User not found", 404));
  }
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.json(`User ${updatedUser.email} Updated Successfully`);
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("User not found", 404));
  }
  const deletedUser = await User.findByIdAndDelete(id);
  res.json(`User ${deletedUser.email} Deleted Successfully`);
});

module.exports = {
  SignUp,
  Login,
  refreshToken,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
};
