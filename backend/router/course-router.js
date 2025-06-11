// In routes/course-router.js
const express = require("express");
const Course = require("../models/course-model");
const router = express.Router();

// POST /api/courses/bulk-add
router.post("/bulk-add", async (req, res) => {
  try {
    const courses = req.body; // Expecting an array of course objects
    await Course.insertMany(courses); // Bulk insert
    res.status(201).json({ message: "Courses added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add courses" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const courses = await Course.find({});
    const allCategories = courses.flatMap(c => c.category);
    const uniqueCategories = [...new Set(allCategories)];
    res.json({ categories: uniqueCategories });
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});


module.exports = router;
