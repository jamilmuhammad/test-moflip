# 🧩 Support Ticket Desk — Documentation

A simple support ticket management system built with **Node.js (Express)**, featuring:

* Basic **login authentication**
* **Role-based access control (USER & ADMIN)**
* **Ticket management** (create, view, resolve)
* **In-memory data** (no external database)
* **CORS support** for frontend connection

---

## 🚀 Overview

| Feature             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| **Login**           | Users and Admins can log in using credentials         |
| **View Tickets**    | Users can view their own tickets; Admins can view all |
| **Create Tickets**  | Any authenticated user can create a support ticket    |
| **Resolve Tickets** | Only Admins can mark a ticket as resolved             |
| **Auth Type**       | Token-based (stored in-memory)                        |
| **Storage**         | No database — all data stored in-memory               |

---

## 🧱 Project Structure

```
support-ticket/
│
├── server.js         # Backend API (Express)
├── index.html        # Simple Frontend UI
├── package.json
└── README.md         # (optional)
```

---

## ⚙️ Installation & Setup

### 1. Clone and install dependencies

```bash
npm init -y
npm install express body-parser cors uuid
```

### 2. Run the server

```bash
node server.js
```

Server runs on:
👉 **[http://localhost:3000](http://localhost:3000)**

### 3. Open frontend

Simply open `index.html` in your browser.

---

## 👥 User Accounts

| Role  | Email               | Password   |
| ----- | ------------------- | ---------- |
| USER  | `user@example.com`  | `user123`  |
| ADMIN | `admin@example.com` | `admin123` |

---

## 🧩 API Documentation

### 1️⃣ `POST /login`

**Authenticate a user and return token.**

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "user123"
}
```

**Response:**

```json
{
  "token": "b7a4-uuid-token",
  "user": {
    "id": "u1",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Error:**

* `401 Unauthorized` → invalid credentials

---

### 2️⃣ `GET /tickets`

**Return tickets depending on user role.**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (USER):**

```json
[
  {
    "id": "t1",
    "userId": "u1",
    "subject": "POS down",
    "message": "Printer not working",
    "status": "OPEN"
  }
]
```

**Response (ADMIN):**

```json
[
  { "id": "t1", "subject": "POS down", "status": "OPEN", ... },
  { "id": "t2", "subject": "Cannot login", "status": "RESOLVED", ... }
]
```

**Error:**

* `401 Unauthorized` → invalid/missing token

---

### 3️⃣ `POST /tickets`

**Create a new support ticket.**

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "subject": "Payment issue",
  "message": "QRIS payment not processing"
}
```

**Response:**

```json
{
  "id": "t3",
  "userId": "u1",
  "subject": "Payment issue",
  "message": "QRIS payment not processing",
  "status": "OPEN"
}
```

---

### 4️⃣ `POST /tickets/:id/resolve`

**Resolve a ticket (ADMIN only).**

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response:**

```json
{ "ok": true }
```

**Error:**

* `403 Forbidden` → non-admin user
* `404 Not Found` → invalid ticket ID

---

## 🧪 Use Case Testing with `cURL`

Here are end-to-end examples for both **User** and **Admin** flows.

---

### 🧍‍♂️ User Login & Ticket Flow

#### 1️⃣ Login as User

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "user123"}'
```

→ Example response:

```json
{
  "token": "user-token-uuid",
  "user": { "id": "u1", "email": "user@example.com", "role": "USER" }
}
```

#### 2️⃣ Create a Ticket

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer user-token-uuid" \
  -d '{"subject": "QRIS not working", "message": "Payment page stuck"}'
```

→ Response:

```json
{
  "id": "t3",
  "userId": "u1",
  "subject": "QRIS not working",
  "message": "Payment page stuck",
  "status": "OPEN"
}
```

#### 3️⃣ View My Tickets

```bash
curl -X GET http://localhost:3000/tickets \
  -H "Authorization: Bearer user-token-uuid"
```

→ Response: Only user’s tickets.

---

### 👨‍💼 Admin Flow

#### 1️⃣ Login as Admin

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'
```

→ Response:

```json
{
  "token": "admin-token-uuid",
  "user": { "id": "u2", "email": "admin@example.com", "role": "ADMIN" }
}
```

#### 2️⃣ View All Tickets

```bash
curl -X GET http://localhost:3000/tickets \
  -H "Authorization: Bearer admin-token-uuid"
```

→ Response: All tickets from all users.

#### 3️⃣ Resolve a Ticket

```bash
curl -X POST http://localhost:3000/tickets/t3/resolve \
  -H "Authorization: Bearer admin-token-uuid"
```

→ Response:

```json
{ "ok": true }
```

#### 4️⃣ Try Resolving as User (Forbidden)

```bash
curl -X POST http://localhost:3000/tickets/t3/resolve \
  -H "Authorization: Bearer user-token-uuid"
```

→ Response:

```json
{ "error": "Forbidden: Admins only" }
```

---

## 🧠 Design Considerations

| Area                                      | Reason                                    |
| ----------------------------------------- | ----------------------------------------- |
| **In-memory data**                        | Fast to prototype, no setup overhead      |
| **Token-based auth**                      | Simple session management for testing     |
| **Role-based logic**                      | Separation of user/admin responsibilities |
| **CORS enabled**                          | Enables browser-based frontend connection |
| **Modular structure (could be expanded)** | Easy to migrate to DB later               |

---

## 🧩 Optional Improvements

1. **JWT Authentication** instead of in-memory tokens
2. **Persistent database** (MongoDB / PostgreSQL)
3. **Pagination and filtering** for tickets
4. **Password hashing**
5. **Frontend framework integration** (React / Vue)

## 📸 Screenshots

### Login Page
![Login Page](https://github.com/jamilmuhammad/test-moflip/blob/main/assets/login.png?raw=true)

### Dashboard Page
![Dashboard Page](https://github.com/jamilmuhammad/test-moflip/blob/main/assets/dashboard.png?raw=true)