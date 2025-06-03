const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  _id: Number, // Custom ID if needed, else remove this line
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  category: [String], // e.g., ["DSA", "Programming Fundamentals"]


  
  tags: {
    1: [String], // Primary tags
    2: [String], // Secondary tags
    3: [String]  // Related topics
  },

  content: [
    {
      title: String,
      videoUrl: String,
      pdfPath: String
    }
  ],

  thumbnail: String, // e.g., "/uploads/thumb-dsa.png"
  createdBy: { type: String }, // userId or username
  date: { type: Date, default: Date.now },
  enrolledCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Course", courseSchema);
