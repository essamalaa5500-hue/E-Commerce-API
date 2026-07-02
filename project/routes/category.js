const express = require("express");
const router = express.Router();
const paginate = require("../../middleware/paginate");
const Category = require("../models/Category");
const validate = require("../../middleware/validate");
const upload = require("../../middleware/uploadImage");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../../middleware/category.validation");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const verifyAdmin = require("../../middleware/verifyAdmin");
const verifyToken = require("../../middleware/verifyToken");

router.get("/", paginate, getAllCategories);
router.get("/:id", getCategoryById);
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  validate(createCategorySchema),
  createCategory,
);
router.patch(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  validate(updateCategorySchema),
  updateCategory,
);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
