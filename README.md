# E-Commerce API

RESTful E-Commerce API built with Node.js, Express.js and MongoDB.

## Features

- JWT Authentication
- Role Based Authorization
- User Management
- Categories
- Products
- Shopping Cart
- Orders
- Reviews
- Image Upload (Cloudinary)
- Password Reset (OTP)
- Email Verification
- Swagger Documentation

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Cloudinary
- Nodemailer
- Swagger

## Installation

```bash
npm install
```

Create `.env` file

```env
PORT=
MONGODB_URI=
JWT_SECRET_KEY=
JWT_REFRESH_TOKEN_SECRET_KEY=
EMAIL_USERNAME=
EMAIL_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run

```bash
npm run dev
```

Swagger

```
http://localhost:5000/api-docs
```