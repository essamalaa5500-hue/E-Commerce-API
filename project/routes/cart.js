const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/verifyToken");

const {
  getMyCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

router.get("/my", verifyToken, getMyCart);

router.post("/my/add", verifyToken, addItemToCart);

router.patch("/:productId", verifyToken, updateItemQuantity);

router.delete("/:productId", verifyToken, removeItemFromCart);

router.delete("/", verifyToken, clearCart);

module.exports = router;
