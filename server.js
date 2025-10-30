// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// const users = [
//     {
//         "id": 1,
//         "email": "test@mail.com",
//         "password": "123",
//         "name": "Test",
//         "role": {
//           "id": 1,
//           "name": "Admin",
//           "permission": {

//           }
//         }
//     },
//     {
//         "id": 2,
//         "email": "test1@mail.com",
//         "password": "123",
//         "name": "Test"
//     },
//     {
//         "id": 3,
//         "email": "test2@mail.com",
//         "password": "123",
//         "name": "Test"
//     },
//     {
//         "id": 4,
//         "email": "test3@mail.com",
//         "password": "123",
//         "name": "Test"
//     },
//     {
//         "id": 5,
//         "email": "test4@mail.com",
//         "password": "123",
//         "name": "Test"
//     }
// ]

// function Login(req, res) {
//     for (let user = 0; user < users.length; user++) {
//         const exist = users[user];
//         // validasi format email & validasi format password (character, length, etc)
//         if (exist?.email == req?.body?.email && exist?.password == req?.body?.password) {
//             console.log("User Exist")
//             return res.json(exist)
//         }
//     }
    
//     return res.json("User not exist")
// }

// app.post('/login', (req, res) => {
//   const userData = {
//     email: "test@mail.com",
//     password: "123"
//   }

//   req.body = userData



//   return Login(req, res)
// })

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(bodyParser.json());
app.use(cors())

// ----------------------
// In-memory data
// ----------------------
const users = [
  { id: "u1", email: "user@example.com", password: "user123", role: "USER" },
  { id: "u2", email: "admin@example.com", password: "admin123", role: "ADMIN" },
];

let tickets = [
  { id: "t1", userId: "u1", subject: "POS down", message: "Printer not working", status: "OPEN" },
  { id: "t2", userId: "u1", subject: "Cannot login", message: "My credentials fail", status: "OPEN" },
];

// token storage (maps token → userId)
const sessions = {};

// ----------------------
// Helper functions
// ----------------------
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  const userId = sessions[token];
  if (!userId) return res.status(401).json({ error: "Invalid token" });

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: "User not found" });

  req.user = user;
  next();
}

// ----------------------
// Routes
// ----------------------

// POST /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const token = uuid();
  sessions[token] = user.id;

  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// GET /tickets
app.get("/tickets", authenticate, (req, res) => {
  const user = req.user;
  if (user.role === "ADMIN") {
    return res.json(tickets);
  } else {
    const userTickets = tickets.filter((t) => t.userId === user.id);
    return res.json(userTickets);
  }
});

// POST /tickets (user creates a new ticket)
app.post("/tickets", authenticate, (req, res) => {
  const { subject, message } = req.body;
  const newTicket = {
    id: uuid(),
    userId: req.user.id,
    subject,
    message,
    status: "OPEN",
  };
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// POST /tickets/:id/resolve
app.post("/tickets/:id/resolve", authenticate, (req, res) => {
  const user = req.user;
  if (user.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  ticket.status = "RESOLVED";
  res.json({ ok: true });
});

// ----------------------
// Start server
// ----------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
