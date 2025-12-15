# 🔐 End-to-End Authentication System (JWT + Refresh Tokens + RBAC)

A **production-ready authentication and authorization system** built using modern security best practices. This project demonstrates how real-world applications handle **secure login sessions**, **token lifecycle management**, and **role-based access control (RBAC)**.

---

## 🚀 Project Overview

This project implements a complete **JWT-based authentication system** with:

* Short-lived **Access Tokens** for API security
* Long-lived **Refresh Tokens** with **rotation and revocation**
* **HTTP-only cookies** for secure token storage
* **Role-Based Access Control (RBAC)** for permission management

It closely follows authentication patterns used in **SaaS platforms, enterprise dashboards, fintech apps, and modern SPAs**.

---

## 🎯 Why This Project?

Traditional login systems are not sufficient for modern applications. This project solves common real-world problems:

* 🔐 Securely keeping users logged in without storing sensitive data in the browser
* 🔄 Handling token expiration without forcing users to log in again
* 🛡 Preventing token theft, replay attacks, and session hijacking
* 👥 Managing multiple user roles (Admin / User)
* 🌐 Supporting Single Page Applications (SPA) like React

---

## ✨ Features

* ✅ User Registration & Login
* 🔑 JWT-based Authentication
* 🔄 Refresh Token Rotation
* 🍪 HTTP-only Cookie Storage
* 🧠 Secure Session Lifecycle Management
* 🛡 Role-Based Access Control (RBAC)
* 🔐 Password Hashing using bcrypt
* 🚫 Token Revocation on Logout
* 📦 MongoDB-based Token Persistence
* ⚙ Middleware-based Route Protection

---

## 🧠 How It Works (Authentication Flow)

### 1️⃣ User Login

* User logs in with email & password
* Password is verified using **bcrypt**
* Server generates:

  * **Access Token** (short-lived)
  * **Refresh Token** (long-lived)

### 2️⃣ Token Storage

* Access Token → stored in **client memory** (React state)
* Refresh Token → stored in **HTTP-only secure cookie**

### 3️⃣ Access Protected APIs

* Client sends Access Token in `Authorization: Bearer <token>` header
* Server verifies token and user roles

### 4️⃣ Token Expiration Handling

* When Access Token expires:

  * Client calls `/auth/refresh`
  * Server verifies Refresh Token
  * Issues new Access Token + Refresh Token
  * Old Refresh Token is revoked (rotation)

### 5️⃣ Logout

* Refresh Token is revoked in database
* Cookie is cleared
* Session is terminated

---

## 🧱 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT (jsonwebtoken)**
* **bcrypt**
* **cookie-parser**
* **dotenv**

### Frontend

* **React.js**
* **Fetch API / Axios**
* **Protected Routes**
* **In-memory Token Storage**

### Security

* HTTP-only Cookies
* Token Hashing (SHA-256)
* Refresh Token Rotation
* Short-lived Access Tokens
* RBAC Middleware

---

## 🗂 Project Structure

```
backend/
 ├── src/
 │   ├── controllers/
 │   │   └── auth.controller.js
 │   ├── middleware/
 │   │   └── auth.js
 │   ├── models/
 │   │   ├── User.js
 │   │   └── RefreshToken.js
 │   ├── routes/
 │   │   └── auth.routes.js
 │   ├── utils/
 │   │   └── tokens.js
 │   └── server.js
 ├── .env
 └── package.json

client/
 └── React Frontend
```

---

## 🔒 Role-Based Access Control (RBAC)

Roles are assigned to users (e.g. `user`, `admin`).

### Example:

```js
app.get('/admin', authenticate, requireRole('admin'), handler);
```

* Users without the required role receive `403 Forbidden`
* Ensures strict backend-level authorization

---

## 🧪 API Endpoints

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/register | Register new user    |
| POST   | /api/auth/login    | Login user           |
| POST   | /api/auth/refresh  | Refresh access token |
| POST   | /api/auth/logout   | Logout user          |
| GET    | /api/profile       | Protected route      |
| GET    | /api/admin         | Admin-only route     |

---

## 🛠 Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/codesofsandeep/AuthProject
cd project
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables (.env)

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=30d
BCRYPT_ROUNDS=12
NODE_ENV=development
```

### 4️⃣ Run Server

```bash
npm run dev
```

---

## 🧪 Testing

* API tested using **Postman**
* Manual testing of:

  * Login & logout flow
  * Token refresh
  * Role-based access
  * Token revocation

---

## 🚀 Future Enhancements

* 🔐 Multi-Factor Authentication (MFA)
* ⚡ Redis-based refresh token storage
* 📊 Session management dashboard
* 📧 Email verification & password reset
* 📜 Audit logs for security events
* 🔄 JWT key rotation

---

## 📌 Resume Highlight

> Developed a production-ready authentication system using JWT, refresh token rotation, and role-based access control (RBAC) with secure session management and token revocation.

---

## 👨‍💻 Author

**Sandeep Rajput**
MCA Student | Full Stack Developer

---

## ⭐ If you like this project

Give it a ⭐ and feel free to fork or contribute!
