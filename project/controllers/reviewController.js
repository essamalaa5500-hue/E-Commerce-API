const Review = require("../models/Review");
const AppError = require("../../utils/AppError");
const asyncHandler = require("express-async-handler");
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find();
  res.json({ message: "All Reviews", data: reviews });
});

const getReviewById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Review not found", 404));
  }
  const review = await Review.findById(id);
  if (!review) {
    return next(new AppError("Review not found", 404));
  }
  res.json({ message: "Review Found", data: review });
});

const createReview = asyncHandler(async (req, res, next) => {
  const { user, product, rating, comment } = req.body;
  const createdReview = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
  });
  res.json({
    message: "Review Created Successfully",
    data: createdReview,
  });
});

const updatedReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Review not found", 404));
  }
  const updatedReview = await Review.findOneAndUpdate(
    {
      _id: id,
      user: req.user._id,
    },
    req.body,
    { new: true },
  );
  if (!updatedReview) {
    return next(new AppError("Review not found", 404));
  }
  res.json({
    message: "Review Updated Successfully",
    data: updatedReview,
  });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Review not found", 404));
  }
  const deletedReview = await Review.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });
  if (!deletedReview) {
    return next(new AppError("Review not found", 404));
  }
  res.json({
    message: "Review Deleted Successfully",
    data: deletedReview,
  });
});

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updatedReview,
  deleteReview,
};
