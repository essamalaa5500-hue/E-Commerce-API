const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../../middleware/verifyToken");
const validate = require("../../middleware/validate");
const { createOrderSchema } = require("../../middleware/order.validation");
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

router.get("/my", verifyToken, getMyOrders);
router.get("/my/:id", verifyToken, getMyOrderById);
router.patch("/my/:id/cancel", verifyToken, cancelOrder);

router.get("/:id", verifyToken, verifyAdmin, getOrderById);
router.patch("/:id", verifyToken, verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);
router.post("/", verifyToken, validate(createOrderSchema), createOrder);

module.exports = router;
