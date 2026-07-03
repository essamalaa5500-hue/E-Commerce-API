const express = require("express");
const router = express.Router();
const User = require("../models/users");
const AppError = require("../../utils/AppError");
const verifyToken = require("../../middleware/verifyToken");
const verfiyAdmin = require("../../middleware/verifyAdmin");
const upload = require("../../middleware/uploadImage");
const validate = require("../../middleware/validate");
const {
  updateUserSchema,
  updateProfileSchema,
} = require("../../middleware/user.validation");
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
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.patch(
  "/updateProfile",
  verifyToken,
  upload.single("profileImage"),
  validate(updateProfileSchema),
  updateProfile,
);
router.patch(
  "/:id",
  verifyToken,
  verfiyAdmin,
  validate(updateUserSchema),
  updateUser,
);

router.delete("/:id", verifyToken, verfiyAdmin, deleteUser);

module.exports = router;
