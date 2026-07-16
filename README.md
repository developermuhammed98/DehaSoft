# DehaSoft — Security-Focused E-Commerce Platform

This project is a full-stack e-commerce application developed in accordance with modern web architectures, API security standards, and secure system design principles.

## 🏗️ General Architecture (Proxy & Isolation)

The application is built on a **secure proxy isolation architecture**:

- **Frontend (Next.js 14):** Serves as the user interface and the proxy controller.
- **Backend (Laravel 13 / API):** Acts as the isolated API server handling data processing, database operations, and JWT-based authentication.
- **Proxy Security Layer:** The client-side frontend never communicates directly with the Laravel API. All communications are proxied via Next.js API Routes. This hides backend API endpoints and prevents direct exposure.
- **Authentication Security:** JWT tokens are stored in secure **httpOnly Cookies**, protecting them from client-side script theft (XSS).

---

## ✨ Features

- **🔑 Secure Authentication**: Sign Up, Log In, Log Out using JWT and httpOnly Cookies.
- **📦 Product Management**: Product listing, detailed views, and an admin CRUD panel.
- **🛒 Shopping Cart**: Add, update quantities, remove items, and clear cart.
- **💳 Order Management**: Place orders and view order history.
- **📈 Exchange Rates**: Real-time USD and EUR exchange rate tracking via external API, displayed dynamically on the navigation bar.
- **🗃️ Database**: Pre-configured with SQLite for instant setup, with seamless MySQL support.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend / Proxy** | Next.js 14, React, TypeScript, CSS |
| **Backend / API** | Laravel 13, PHP, JWT (Tymon JWT) |
| **Database** | SQLite (Default), MySQL |
| **Testing** | Postman API Collections |

---

## ⚙️ Local Development & Setup

### 1. Backend Setup (Laravel)
```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve --port=8000
```
> The backend API will start at **http://127.0.0.1:8000**

### 2. Frontend Setup (Next.js)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
> The application UI will start at **http://localhost:3000**

---

## 📂 Project Structure

```
dehasoft-ecommerce/
├── backend/          # Laravel API (PHP)
│   ├── app/
│   ├── database/
│   │   └── database.sqlite   # SQLite database
│   ├── routes/api.php
│   └── .env
├── frontend/         # Next.js (Proxy Layer)
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── .env.local
└── Dehasoft_API_Postman.json
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
