// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const studentRoutes = require("./routes/student");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// health check / DB test
app.get('/api/ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ ok: true, result: rows[0].result });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/protected", auth(), (req, res) => {
  res.json({ message: `Hello ${req.user.username || req.user.id}, role: ${req.user.role}` });
});

// Admin-only test route
app.get("/api/admin-only", auth("admin"), (req, res) => {
  res.json({
    message: `Welcome Admin ${req.user.username}`
  });
});

// Student-only test route
app.get("/api/student-only", auth("student"), (req, res) => {
  res.json({
    message: `Welcome Student ${req.user.student_name}`
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
