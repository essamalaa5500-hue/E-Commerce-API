# 🛒 E-Commerce API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A production-ready RESTful API for an E-Commerce platform built with **Node.js**, **Express.js**, and **MongoDB**.

The API provides secure authentication, product management, shopping cart, categories, reviews, orders, password recovery, image upload, and interactive API documentation with Swagger.

---

# 🚀 Live Demo

### API Base URL

https://essam-ecommerce-api.bonto.run

### Swagger Documentation

https://essam-ecommerce-api.bonto.run/api-docs

---

# ✨ Features

## 🔐 Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Password Hashing using bcrypt

---

## 👤 Users

- Get User Profile
- Update User Profile

---

## 📦 Products

- Create Product
- Update Product
- Delete Product
- Get All Products
- Get Product By ID
- Search Products
- Filter Products
- Sort Products
- Pagination
- Upload Product Images (Cloudinary)

---

## 📂 Categories

- Create Category
- Update Category
- Delete Category
- Get Categories

---

## 🛒 Shopping Cart

- Add Product To Cart
- Update Product Quantity
- Remove Product
- Clear Cart
- Get Logged User Cart

---

## ⭐ Reviews

- Add Review
- Update Review
- Delete Review
- Get Product Reviews

---

## 📦 Orders

- Create Order
- Get Logged User Orders
- Get All Orders (Admin)
- Update Order Status
- Update Payment Status

---

## 🔑 Password Management

- Change Password
- Forgot Password
- Reset Password
- Send Verification Email

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi
- Express Validator
- Multer
- Cloudinary
- Nodemailer
- Helmet
- CORS
- Swagger UI

---

# 📂 Project Structure

```text
E-Commerce-API
│
├── config
├── docs
├── middleware
├── src
│   ├── controllers
│   ├── models
│   └── routes
├── utils
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/essamalaa5500-hue/E-Commerce-API.git
```

Move into the project

```bash
cd E-Commerce-API
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

Run Development Server

```bash
npm run dev
```

Run Production Server

```bash
npm start
```

---

# 🔐 Authentication

Most endpoints require a JWT access token.

Example:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📖 Main API Endpoints

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/users/register`           | Register a new user     |
| POST   | `/users/login`              | Login user              |
| GET    | `/users/profile`            | Get logged user profile |
| PUT    | `/users/profile`            | Update profile          |
| GET    | `/product`                  | Get all products        |
| GET    | `/product/:id`              | Get product by ID       |
| POST   | `/product`                  | Create product          |
| PUT    | `/product/:id`              | Update product          |
| DELETE | `/product/:id`              | Delete product          |
| GET    | `/category`                 | Get all categories      |
| POST   | `/cart`                     | Add product to cart     |
| GET    | `/cart`                     | Get logged user cart    |
| POST   | `/review`                   | Add review              |
| POST   | `/order`                    | Create order            |
| POST   | `/password/forgot-password` | Forgot password         |
| POST   | `/password/reset-password`  | Reset password          |

> 📌 For the complete API reference, visit the Swagger documentation.

---

# 📖 Swagger Documentation

https://essam-ecommerce-api.bonto.run/api-docs

---

# 📌 HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet
- CORS
- Input Validation
- Global Error Handling

---

# 🧪 API Testing

You can test the API using:

- Swagger UI
- Postman

---

# 👨‍💻 Author

**Essam Alaa**

Backend Developer

GitHub:
https://github.com/essamalaa5500-hue

---

# ⭐ Support

If you like this project, don't forget to leave a ⭐ on GitHub.
