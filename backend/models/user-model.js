const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },

  stream:    { type: String },
  preferences: [String],
  

  coursesRead:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  coursesAdded: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  booksRead:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  booksAdded:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// JWT token method
userSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
};

// Compare password method
userSchema.methods.compare = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
