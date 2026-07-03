const Category = require("../models/Category");
const AppError = require("../../utils/AppError");
const paginate = require("../../middleware/paginate");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const Product = require("../models/Product");

const getAllCategories = asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const categories = await Category.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const totalCount = await Category.countDocuments();
  res.status(200).json({
    success: true,
    page,
    total: Math.ceil(totalCount / limit),
    results: categories.length,
    data: categories,
  });
});

const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Category image is required", 400));
  }

  try {
    const category = await Category.create({
      ...req.body,
      image: {
        url: req.file.path,
        publicId: req.file.filename,
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    await cloudinary.uploader.destroy(req.file.filename);

    return next(error);
  }
});
const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  const oldPublicId = category.image.publicId;
  if (req.file) {
    req.body.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (req.file && oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }
    res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      data: updatedCategory,
    });
  } catch (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    return next(error);
  }
});
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  const productCount = await Product.countDocuments({
    category: category._id,
  });
  if (productCount > 0) {
    return next(new AppError("Category has products, can not be deleted", 400));
  }
  try {
    await cloudinary.uploader.destroy(category.image.publicId);
    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
