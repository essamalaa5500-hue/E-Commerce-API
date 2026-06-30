const express = require("express");
const router = express.Router();
const paginate = require("../../middleware/paginate");
const Category = require("../models/Category");
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
router.post("/", verifyToken, verifyAdmin, createCategory);
router.patch("/:id", verifyToken, verifyAdmin, updateCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
