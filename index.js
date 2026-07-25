const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

require("./config/db");

const swaggerDocs = require("./docs/swagger");
const routesUser = require("./src/routes/user");
const routesProduct = require("./src/routes/product");
const routesCategory = require("./src/routes/category");
const routesCart = require("./src/routes/cart");
const routesReview = require("./src/routes/review");
const routesOrder = require("./src/routes/order");
const routesPassword = require("./src/routes/password");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "E-Commerce API is running 🚀",
  });
});

swaggerDocs(app);

app.use("/users", routesUser);
app.use("/product", routesProduct);
app.use("/category", routesCategory);
app.use("/cart", routesCart);
app.use("/review", routesReview);
app.use("/order", routesOrder);
app.use("/password", routesPassword);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    error: err.errors || null,
  });
});

console.log("BASE_URL from env:", process.env.BASE_URL);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
