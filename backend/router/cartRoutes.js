const express=require("express");
const router=express.Router();
const User=require("../models/user-model");
const authMiddleware=require("../middlewares/auth-middleware");
const mongoose = require("mongoose");

router.post("/toggle-cart/:courseId", authMiddleware, async (req, res) => {
  try {
    console.log(`toggle ${req}`);
    const userId = req.userID;
    const courseIdParam = req.params.courseId;

    // ✅ Check if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseIdParam)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const courseId = new mongoose.Types.ObjectId(courseIdParam);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.coursesAdded.indexOf(courseId);
    let message = "";

    if (index === -1) {
      user.coursesAdded.push(courseId);
      message = "Course added to cart";
    } else {
      user.coursesAdded.splice(index, 1);
      message = "Course removed from cart";
    }

    await user.save();
    res.status(200).json({ message });
  } catch (error) {
    console.error("Cart toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/toggle-read/:courseId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userID;
    const courseIdParam = req.params.courseId;

    // ✅ Check if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseIdParam)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const courseId = new mongoose.Types.ObjectId(courseIdParam);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.coursesRead.indexOf(courseId);
    let message = "";

    if (index === -1) {
      user.coursesRead.push(courseId);
      message = "Course marked as Read";
    } else {
      user.coursesAdded.splice(index, 1);
      message = "Course unmarked";
    }

    await user.save();
    res.status(200).json({ message });
  } catch (error) {
    console.error("Cart toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Toggle BOOK in cart
router.post("/toggle-book-cart/:bookId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userID;
    const bookId = req.params.bookId;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.booksAdded.indexOf(bookId);
    let message;

    if (idx === -1) {
      user.booksAdded.push(bookId);
      message = "Book added to cart";
    } else {
      user.booksAdded.splice(idx, 1);
      message = "Book removed from cart";
    }

    await user.save();
    res.status(200).json({ message });
  } catch (error) {
    console.error("toggle-book-cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Toggle BOOK as read
router.post("/toggle-book-read/:bookId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userID;
    const bookId = req.params.bookId;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.booksRead.indexOf(bookId);
    let message;

    if (idx === -1) {
      user.booksRead.push(bookId);
      message = "Book marked as read";
    } else {
      user.booksRead.splice(idx, 1);
      message = "Book unmarked as read";
    }

    await user.save();
    res.status(200).json({ message });
  } catch (error) {
    console.error("toggle-book-read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
