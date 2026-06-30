const Order = require("../models/Order");
const AppError = require("../../utils/AppError");

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.json({ message: "All Orders", data: orders });
};

const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.json({ message: `Order ${order.name} found`, data: order });
};

const createOrder = async (req, res, next) => {
  const { products } = req.body;

  let totalPrice = 0;

  for (const item of products) {
    totalPrice += item.price * item.quantity;
  }

  const createdOrder = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
  });

  res.status(201).json({
    message: "Order Created Successfully",
    data: createdOrder,
  });
};

const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Order not found", 404));
  }
  const updatedOreder = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedOreder) {
    return next(new AppError("Order not found", 404));
  }
  res.json({
    message: `Order ${updatedOreder.name} Updated Successfully`,
    data: updatedOreder,
  });
};

const deleteOrder = async (req, res, next) => {
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
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
