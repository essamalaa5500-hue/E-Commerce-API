const Order = require("../models/Order");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json({ message: "All Orders", data: orders });
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.json({ message: `Order ${order.name} found`, data: order });
});
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json({ message: "My Orders", data: orders });
});
const getMyOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  const order = await Order.findOne({ _id: id, user: req.user._id });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.json({ message: `Order ${order.name} found`, data: order });
});
const createOrder = async (req, res, next) => {
  const { products } = req.body;

  if (!products || !products.length) {
    return next(new AppError("products are required", 400));
  }

  let totalPrice = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product ${item.product} not found`, 404));
    }
    if (!item.quantity || item.quantity < 1) {
      return next(new AppError("Invalid quantity", 400));
    }
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name}`, 400));
    }

    orderProducts.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });
    totalPrice += product.price * item.quantity;
  }

  const createdOrder = await Order.create({
    user: req.user._id,
    products: orderProducts,
    totalPrice,
  });

  res.status(201).json({
    message: "Order Created Successfully",
    data: createdOrder,
  });
};

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  const order = await Order.One({ _id: id, user: req.user._id });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.paymentStatus !== "pending") {
    return next(new AppError("Only pending order can be cancelled", 400));
  }
  order.paymentStatus = "cancelled";
  await order.save();
  res.json({
    message: "Order cancelled successfully",
    data: order,
  });
});

const updateOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  const allowedPaymentStatus = ["pending", "paid", "failed", "cancelled"];
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  if (!paymentStatus || !allowedPaymentStatus.includes(paymentStatus)) {
    return next(new AppError("Invalid payment status", 400));
  }
  const updateOrder = await Order.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true },
  );
  if (!updatedOreder) {
    return next(new AppError("Order not found", 404));
  }
  res.json({
    message: `Order Updated Successfully`,
    data: updatedOreder,
  });
});

const deleteOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  const deletedOrder = await Order.findByIdAndDelete(id);
  if (!deletedOrder) {
    return next(new AppError("Order not found", 404));
  }
  res.json({
    message: `Order ${deletedOrder.name} Deleted Successfully`,
    data: deletedOrder,
  });
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
};
