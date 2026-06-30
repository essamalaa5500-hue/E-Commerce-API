const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity should be greater than 0"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price should be greater than 0"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price should be greater than 0"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", CartSchema);
