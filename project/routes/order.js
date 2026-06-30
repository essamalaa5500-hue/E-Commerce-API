const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../../middleware/verifyToken");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.get("/:id", verifyToken, verifyAdmin, getOrderById);
router.post("/", verifyToken, createOrder);
router.patch("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

module.exports = router;
