const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all students
router.get("/students", auth("admin"), async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM student_details");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
