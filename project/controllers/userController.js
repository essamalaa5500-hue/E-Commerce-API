const User = require("../models/users");
const AppError = require("../../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");

const SignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  createdUser.password = undefined;

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: createdUser,
  });
});

const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
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

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  user.password = undefined;
  user.refreshToken = undefined;

  res.status(200).json({
    success: true,
    accessToken,
    user,
  });
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

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  res.status(200).json({
    success: true,
    accessToken,
  });
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

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "+profileImagePublicId",
  );

  if (!user) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    return next(new AppError("User not found", 404));
  }

  const updates = {};

  if (req.body.name) updates.name = req.body.name;
  if (req.body.email) updates.email = req.body.email;
  if (req.body.phone) updates.phone = req.body.phone;

  if (req.file) {
    updates.profileImage = req.file.path;
    updates.profileImagePublicId = req.file.filename;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (req.file && user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    next(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");

  res.status(200).json({
    success: true,
    results: users.length,
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "-password -refreshToken",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "+profileImagePublicId",
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.profileImagePublicId) {
    await cloudinary.uploader.destroy(user.profileImagePublicId);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = {
  SignUp,
  Login,
  refreshToken,
  logout,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
