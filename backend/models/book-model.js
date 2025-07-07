const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Google Books API ID
  // MongoDB will automatically generate _id (ObjectId)
  title: String,
  authors: [String],
  publisher: String,
  publishedDate: String,
  description: String,
  pageCount: Number,
  categories: [String],
  thumbnail: String,
  previewLink: String,
  infoLink: String,
  canonicalVolumeLink: String,
  language: String,
  saleability: String,
  isEbook: Boolean,
  buyLink: String,
  webReaderLink: String,
  pdfAvailable: Boolean,
  epubAvailable: Boolean,
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;