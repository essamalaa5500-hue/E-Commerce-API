const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const verifyToken = require("../../middleware/verifyToken");
const {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
} = require("../controllers/cartController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/", verifyToken, getAllCarts);
router.get("/:id", verifyToken, getCartById);
router.post("/", verifyToken, createCart);
router.patch("/:id", verifyToken, updateCart);
router.delete("/:id", verifyToken, deleteCart);

module.exports = router;
