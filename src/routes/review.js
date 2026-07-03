const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const verifyToken = require("../../middleware/verifyToken");
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.get("/", verifyToken, verifyAdmin, getAllReviews);
router.get("/:id", verifyToken, verifyAdmin, getReviewById);
router.post("/", verifyToken, createReview);
router.patch("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;
