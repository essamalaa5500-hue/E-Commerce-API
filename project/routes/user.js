const express = require("express");
const router = express.Router();
const User = require("../models/users");
const AppError = require("../../utils/AppError");
const verifyToken = require("../../middleware/verifyToken");
const verfiyAdmin = require("../../middleware/verifyAdmin");

const {
  SignUp,
  Login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshToken,
  logout,
  updateProfile,
} = require("../controllers/userController");
const joi = require("joi");
const {
  SignUpValidation,
  LoginValidation,
} = require("../../middleware/AuthScema");

router.get("/", verifyToken, verfiyAdmin, getAllUsers);

router.get("/:id", verifyToken, verfiyAdmin, getUserById);

router.post("/signup", SignUpValidation, SignUp);

router.post("/login", LoginValidation, Login);
router.post("/refresh", verifyToken, refreshToken);
router.post("/logout", logout);
router.patch("/updateProfile", verifyToken, updateProfile);
router.patch("/:id", verifyToken, verfiyAdmin, updateUser);

router.delete("/:id", verifyToken, verfiyAdmin, deleteUser);

module.exports = router;
