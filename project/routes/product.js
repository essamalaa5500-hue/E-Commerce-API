const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const paginate = require("../../middleware/paginate");
const verfiyToken = require("../../middleware/verifyToken");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/", paginate, getAllProducts);
router.get("/:id", getProductById);
router.post("/", verfiyToken, verifyAdmin, createProduct);
router.patch("/:id", verfiyToken, verifyAdmin, updateProduct);
router.delete("/:id", verfiyToken, verifyAdmin, deleteProduct);

module.exports = router;
