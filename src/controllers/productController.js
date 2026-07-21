const Product = require("../models/Product");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const cloudinary = require("../../config/cloudinary");
const Category = require("../models/Category");

const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit } = req.pagination;
  const skip = (page - 1) * limit;
  const products = await Product.find()
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalCount = await Product.countDocuments();
  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(totalCount / limit),
    results: products.length,
    data: products,
  });
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name image",
  );
  if (!product) {
    return next(new AppError("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

const createProduct = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("At least one image is required", 400));
  }

  const category = await Category.findById(req.body.category);

  if (!category) {
    for (const file of req.files) {
      await cloudinary.uploader.destroy(file.filename);
    }

    return next(new AppError("Category not found", 404));
  }

  const images = req.files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  let product;

  try {
    product = await Product.create({
      ...req.body,
      slug: slugify(req.body.name, {
        lower: true,
        strict: true,
      }),
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    for (const image of images) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    next(error);
  }
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    if (req.files?.length) {
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
    }

    return next(new AppError("Product not found", 404));
  }

  if (req.body.category) {
    const category = await Category.findById(req.body.category);

    if (!category) {
      if (req.files?.length) {
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }

      return next(new AppError("Category not found", 404));
    }
  }

  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });
  }

  const oldImages = product.images;

  if (req.files?.length) {
    req.body.images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (req.files?.length) {
      for (const image of oldImages) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    if (req.files?.length) {
      for (const file of req.files) {
        await cloudinary.uploader.destroy(file.filename);
      }
    }

    next(error);
  }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  try {
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
