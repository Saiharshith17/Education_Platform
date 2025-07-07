const express = require("express");
const Book = require("../models/book-model");
const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const books = await Book.find({}); // Fetch all books
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});
// Bulk add books
router.post("/bulk-add", async (req, res) => {
  try {
    const books = req.body; // Array of Google Books API objects

    // Transform each Google Book object to match your schema
    const transformedBooks = books.map(googleBook => {
      const info = googleBook.volumeInfo || {};
      const sale = googleBook.saleInfo || {};
      const access = googleBook.accessInfo || {};

      return {
        googleId: googleBook.id,
        title: info.title,
        authors: info.authors,
        publisher: info.publisher,
        publishedDate: info.publishedDate,
        description: info.description,
        pageCount: info.pageCount,
        categories: info.categories,
        thumbnail: info.imageLinks?.thumbnail,
        previewLink: info.previewLink,
        infoLink: info.infoLink,
        canonicalVolumeLink: info.canonicalVolumeLink,
        language: info.language,
        saleability: sale.saleability,
        isEbook: sale.isEbook,
        buyLink: sale.buyLink,
        webReaderLink: access.webReaderLink,
        pdfAvailable: access.pdf?.isAvailable,
        epubAvailable: access.epub?.isAvailable,
      };
    });

    await Book.insertMany(transformedBooks, { ordered: false });
    res.status(201).json({ message: "Books added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add books", details: err.message });
  }
});

module.exports = router;