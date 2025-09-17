// server/routes/student.js
const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Get logged-in student's details
router.get("/me", auth("student"), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT sl_no, course_name, roll_no, enroll_no, student_name, father_name, mother_name, age, medal, dob, email, phone_no, photo, signature, submitted FROM student_details WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Student not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update extra details
// router.put("/update", auth("student"), async (req, res) => {
//   const { age, medal, dob, email, phone_no } = req.body;

//   try {
//     await pool.execute(
//       "UPDATE student_details SET age = ?, medal = ?, dob = ?, email = ?, phone_no = ?, submitted = 1 WHERE id = ?",
//       [age, medal, dob, email, phone_no, req.user.id]
//     );

//     res.json({ message: "Details updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.put("/update", auth("student"), async (req, res) => {
  let { age, medal, dob, email, phone_no } = req.body;

  try {
    // Convert dob to YYYY-MM-DD if it exists
    if (dob) {
      dob = new Date(dob).toISOString().split("T")[0];
    }

    await pool.execute(
      "UPDATE student_details SET age = ?, medal = ?, dob = ?, email = ?, phone_no = ?, submitted = 1 WHERE id = ?",
      [age, medal, dob, email, phone_no, req.user.id]
    );

    res.json({ message: "Details updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload photo
router.post("/upload/photo", auth("student"), upload.single("photo"), async (req, res) => {
  try {
    const filePath = req.file.filename;
    await pool.execute("UPDATE student_details SET photo = ? WHERE id = ?", [filePath, req.user.id]);
    res.json({ message: "Photo uploaded successfully", file: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload signature
router.post("/upload/signature", auth("student"), upload.single("signature"), async (req, res) => {
  try {
    const filePath = req.file.filename;
    await pool.execute("UPDATE student_details SET signature = ? WHERE id = ?", [filePath, req.user.id]);
    res.json({ message: "Signature uploaded successfully", file: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
