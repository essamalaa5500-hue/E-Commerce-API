const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const verifyToken = require("../../middleware/verifyToken");
const {
  getMyCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/my", verifyToken, getMyCart);
router.post("/my/add", verifyToken, addItemToCart);
router.patch("/my/update/:productId", verifyToken, updateItemQuantity);
router.delete("/my/remove/:productId", verifyToken, removeItemFromCart);
router.delete("/my/clear", verifyToken, clearCart);

module.exports = router;
