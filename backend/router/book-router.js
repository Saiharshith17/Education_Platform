const express = require("express");
const Book = require("../models/book-model");
const router = express.Router();

// Bulk add books
router.post("/bulk-add", async (req, res) => {
  try {
    const books = req.body; // Expecting an array of book objects
    await Book.insertMany(books, { ordered: false }); // ordered:false skips duplicates
    res.status(201).json({ message: "Books added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add books", details: err.message });
  }
});

module.exports = router;