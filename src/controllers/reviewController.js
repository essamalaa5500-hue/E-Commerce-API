const Review = require("../models/Review");
const Product = require("../models/Product");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");

const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats.length ? stats[0].averageRating : 0,
    numReviews: stats.length ? stats[0].numReviews : 0,
  });
};

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name")
    .populate("product", "name");

  res.status(200).json({
    success: true,
    results: reviews.length,
    data: reviews,
  });
});

const getReviewById = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate("user", "name")
    .populate("product", "name");

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

const createReview = asyncHandler(async (req, res, next) => {
  const { product, rating, comment } = req.body;

  const productExists = await Product.findById(product);

  if (!productExists) {
    return next(new AppError("Product not found", 404));
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    product,
  });

  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  const createdReview = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
  });

  await updateProductRating(product);

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: createdReview,
  });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  await updateProductRating(review.product);

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  const productId = review.product;

  await review.deleteOne();

  await updateProductRating(productId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
