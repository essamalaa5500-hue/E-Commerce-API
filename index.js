const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

require("./config/db");

const swaggerDocs = require("./docs/swagger");

const routesUser = require("./project/routes/user");
const routesProduct = require("./project/routes/product");
const routesCategory = require("./project/routes/category");
const routesCart = require("./project/routes/cart");
const routesReview = require("./project/routes/review");
const routesOrder = require("./project/routes/order");
const routesUpload = require("./project/routes/upload");
const routesPassword = require("./project/routes/password");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Commerce API is running 🚀",
  });
});

// Swagger
swaggerDocs(app);

// Routes
app.use("/users", routesUser);
app.use("/product", routesProduct);
app.use("/category", routesCategory);
app.use("/cart", routesCart);
app.use("/review", routesReview);
app.use("/order", routesOrder);
app.use("/upload", routesUpload);
app.use("/password", routesPassword);

// 404 Handler
app.get("/", (req, res) => {
  res.json({ message: "E-Commerce API is running 🚀" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    error: err.errors || null,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
