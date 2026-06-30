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
  getMyOrders,
  getMyOrderById,
  cancelOrder,
} = require("../controllers/orderController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.get("/:id", verifyToken, verifyAdmin, getOrderById);
router.patch("/:id", verifyToken, verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

router.get("/my", verifyToken, getMyOrders);
router.get("/my/:id", verifyToken, getMyOrderById);
router.patch("/my/:id/cancel", verifyToken, cancelOrder);
router.post("/", verifyToken, createOrder);

module.exports = router;
