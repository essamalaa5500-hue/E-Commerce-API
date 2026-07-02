const express = require("express");
const router = express.Router();
const paginate = require("../../middleware/paginate");
const verfiyToken = require("../../middleware/verifyToken");
const validate = require("../../middleware/validate");
const upload = require("../../middleware/uploadImage");
const {
  createProductSchema,
  updateProductSchema,
} = require("../../middleware/products.validation");
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
router.post(
  "/",
  verfiyToken,
  verifyAdmin,
  upload.array("images", 5),
  validate(createProductSchema),
  createProduct,
);
router.patch(
  "/:id",
  verfiyToken,
  verifyAdmin,
  upload.array("images", 5),
  validate(updateProductSchema),
  updateProduct,
);
router.delete("/:id", verfiyToken, verifyAdmin, deleteProduct);

module.exports = router;
