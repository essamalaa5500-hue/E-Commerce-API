const Product = require("../models/Product");
const AppError = require("../../utils/AppError");
const paginate = require("../../middleware/paginate");
const asyncHandler = require("express-async-handler");
const getAllProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice } = req.query;
  const filter = {};
  if (keyword) {
    filter.name = {
      $regex: keyword,
      $options: "i",
    };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
  }
  if (minPrice !== undefined) {
    filter.price.$gte = Number(minPrice);
  }
  if (maxPrice !== undefined) {
    filter.price.$lte = Number(maxPrice);
  }
  const { skip, limit } = req.pagination;
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("category");
  res.json({ message: "All Products", data: products });
});

const getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Product not found", 404));
  }
  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.json({ message: `Product ${product.name} found`, data: product });
});

const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, category, images } = req.body;

  if (!images || !images.length) {
    return next(new AppError("images are required", 400));
  }

  try {
    const createdProduct = await Product.create({
      name,
      description,
      price,
      images,
      stock,
      category,
    });

    res.status(201).json({
      message: `Product ${createdProduct.name} Created Successfully`,
      data: createdProduct,
    });
  } catch (error) {
    return next(new AppError("Error occured while creating product", 500));
  }
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Product not found", 404));
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedProduct) {
    return next(new AppError("Product not found", 404));
  }
  res.json({
    message: `Product ${updatedProduct.name} Updated Successfully`,
    data: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Product not found", 404));
  }
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    return next(new AppError("Product not found", 404));
  }
  res.json({
    message: `Product ${deletedProduct.name} Deleted Successfully`,
    data: deletedProduct,
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
