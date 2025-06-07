const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Database", "AI"
  tags: [String], // e.g., ["mongodb", "sql", "nosql"]

  pdfPath: { type: String },     // e.g., "/uploads/db-guide.pdf"
  coverImage: { type: String },  // e.g., "/uploads/db-cover.png"

  createdAt: { type: Date, default: Date.now },
  enrollmentCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Book", bookSchema);
