const Order = require("../models/Order");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("products.product", "name price images")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: orders,
  });
});

const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("products.product", "name price images");
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("products.product", "name price images")
    .sort({ createdAt: -1 });
  res.json({ message: "All Orders", data: orders });
});

const getMyOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  })
    .populate("products.product", "name price images")
    .populate("user", "name email");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

const createOrder = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products } = req.body;

    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new AppError(`Product ${item.product} not found`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      product.stock -= item.quantity;

      await product.save({ session });

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    const [createdOrder] = await Order.create(
      [
        {
          user: req.user._id,
          products: orderProducts,
          totalPrice,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (!["pending", "processing"].includes(order.orderStatus)) {
    return next(new AppError("This order can no longer be cancelled", 400));
  }

  for (const item of order.products) {
    const product = await Product.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.orderStatus = "cancelled";
  await order.save();

  res.status(200).json({
    success: true,
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
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true },
  );
  if (!updatedOrder) {
    return next(new AppError("Order not found", 404));
  }
  res.json({
    message: `Order Updated Successfully`,
    data: updatedOrder,
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
    message: `Order Deleted Successfully`,
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
