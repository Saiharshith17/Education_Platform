const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();
const User = require('../models/user-model');

router.post('/preferences', authMiddleware, async (req, res) => {
  try {
    const userId = req.userID;
    const { preferences } = req.body;

    // Validate preferences
    if (!Array.isArray(preferences) || preferences.length !== 3) {
      return res.status(400).json({ message: "Select exactly 3 preferences." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.preferences = preferences;
    await user.save();
    res.status(200).json({ message: "Preferences saved successfully" });
    console.log("Preferences saved:", preferences);

  } catch (err) {
    console.log("Error saving preferences:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const userId = req.userID;
    const { preferences } = req.body;

    // Validate preferences
    if (!Array.isArray(preferences) || preferences.length !== 3) {
      return res.status(400).json({ message: "Select exactly 3 preferences." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.preferences = preferences;
    await user.save();
    res.status(200).json({ message: "Preferences saved successfully" });
    console.log("Preferences saved:", preferences);

  } catch (err) {
    console.log("Error saving preferences:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;