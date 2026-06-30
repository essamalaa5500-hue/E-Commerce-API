const Cart = require("../models/Cart");
const AppError = require("../../utils/AppError");

const getAllCarts = async (req, res) => {
  const carts = await Cart.find();
  res.json({ message: "All Carts", data: carts });
};

const getCartById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Cart not found", 404));
  }
  const cart = await Cart.findById(id);
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  res.json({ message: `Cart ${cart.name} found`, data: cart });
};

const createCart = async (req, res, next) => {
  const { user, products, quantity, price, totalPrice } = req.body;
  const createdCart = await Cart.create({
    user,
    products,
    quantity,
    price,
    totalPrice,
  });
  res.json({
    message: `Cart ${createdCart} Created Successfully`,
    data: createdCart,
  });
};

const updateCart = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Cart not found", 404));
  }
  const updatedCart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedCart) {
    return next(new AppError("Cart not found", 404));
  }
  res.json({
    message: `Cart ${updatedCart.name} Updated Successfully`,
    data: updatedCart,
  });
};

const deleteCart = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Cart not found", 404));
  }
  const deletedCart = await Cart.findByIdAndDelete(id);
  if (!deletedCart) {
    return next(new AppError("Cart not found", 404));
  }
  res.json({
    message: `Cart ${deletedCart.name} Deleted Successfully`,
    data: deletedCart,
  });
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
