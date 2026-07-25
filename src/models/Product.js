const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [3, "Name should be at least 3 characters"],
      maxlength: [150, "Name should be less than 150 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: false,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [3000, "Description should be less than 3000 characters"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price should be greater than 0"],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock should be greater than 0"],
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
