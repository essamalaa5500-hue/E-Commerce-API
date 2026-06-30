const Cart = require("../models/Cart");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");

const getOrCreateCart = asyncHandler(async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [], totalPrice: 0 });
  }
  return cart;
});

const recalculateTotal = asyncHandler(async (req, res, next) => {
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
});

const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ message: "My Cart", data: cart });
});

const addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) {
    return next(new AppError("Invalid product or quantity", 400));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  if (product.stock < quantity) {
    return next(new AppError(`Insufficient stock for ${product.name}`, 400));
  }
  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.products.find(
    (item) => item.product.toString() === productId,
  );
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = product.price;
  } else {
    cart.products.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }
  recalculateTotal(cart);
  await cart.save();
  res.json({
    message: "Item added to cart successfully",
    data: cart,
  });
});

const updateItemQuantity = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new AppError("A valid quantity is required", 400));
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.products.find(
    (item) => item.product.toString() === productId,
  );
  if (!item) {
    return next(new AppError("Item not found in cart", 404));
  }

  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) {
    return next(new AppError("Insufficient stock", 400));
  }

  item.quantity = quantity;
  item.price = product.price;
  recalculateTotal(cart);
  await cart.save();

  res.json({ message: "Cart item updated", data: cart });
});

const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  const itemExists = cart.products.some(
    (item) => item.product.toString() === productId,
  );
  if (!itemExists) {
    return next(new AppError("Item not found in cart", 404));
  }
  cart.products = cart.products.filter(
    (item) => item.product.toString() !== productId,
  );
  recalculateTotal(cart);
  await cart.save();
  res.json({ message: "Item removed from cart", data: cart });
});

const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.products = [];
  cart.totalPrice = 0;
  await cart.save();
  res.json({ message: "Cart cleared", data: cart });
});

module.exports = {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  getMyCart,
};
