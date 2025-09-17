const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// Generate JWT
function generateToken(user, role) {
  return jwt.sign(
    { id: user.id, username: user.username || user.student_name, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// Single login route for admin & student
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  if (!role || !["admin", "student"].includes(role)) {
    return res.status(400).json({ message: "Role is required (admin/student)" });
  }

  try {
    if (role === "admin") {
      const [rows] = await pool.execute("SELECT * FROM admin WHERE username = ?", [username]);
      if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

      const admin = rows[0];
      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) return res.status(400).json({ message: "Invalid credentials" });

      const token = generateToken(admin, "admin");
      return res.json({ token, role: "admin", user: { username: admin.username } });

    } else if (role === "student") {
      const [rows] = await pool.execute("SELECT * FROM student_details WHERE enroll_no = ?", [username]);
      if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

      const student = rows[0];
      const valid = await bcrypt.compare(password, student.password);
      if (!valid) return res.status(400).json({ message: "Invalid credentials" });

      const token = generateToken(student, "student");
      return res.json({ token, role: "student", user: { student_name: student.student_name, id: student.id } });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
