# 🍔 Food Delivery Web Application

A full-stack food delivery web application built using the MERN stack. The application allows users to browse food items, create an account, manage their cart, place orders, and make online payments. It also includes a separate admin panel for managing food items and orders.

## 🚀 Live Demo

### Frontend
https://food-del-c9zq.vercel.app/


---

## 📌 Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Browse available food items
- Filter food items by category
- Add food items to cart
- Update cart quantity
- Remove items from cart
- Place food orders
- Online payment integration using Stripe
- View order details
- View order history
- Responsive user interface
- Login rate limiting for protection against repeated login attempts

### 🛠️ Admin Features

- Admin authentication
- Add new food items
- Upload food images
- Remove food items
- View food items
- Manage customer orders
- Update order status

### 🔐 Security Features

- JWT authentication
- Password hashing using bcrypt
- Environment variables for sensitive configuration
- CORS configuration
- Token Bucket based rate limiting
- IP-based request tracking
- HTTP 429 response for excessive login attempts

---

## 🏗️ Project Architecture

The project is divided into three main applications:

```text
Food-del/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── Admin/
    ├── src/
    ├── public/
    └── package.json
