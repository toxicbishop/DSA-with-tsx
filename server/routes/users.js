const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");
const _ = require("lodash");
const router = express.Router();

router.put("/progress", verifyToken, async (req, res) => {
  try {
    const { completedPrograms } = req.body;
    if (!Array.isArray(completedPrograms)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid format" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { completedPrograms: { $each: completedPrograms } } },
      { new: true },
    );

    res.json({ success: true, completedPrograms: user.completedPrograms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, username, age, bio, picture } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (username !== undefined) updateData.username = username || undefined;
    if (age !== undefined) updateData.age = age === "" ? null : Number(age);
    if (bio !== undefined) updateData.bio = bio;
    if (picture) updateData.picture = picture;

    // Check if username is already taken (case-insensitive)
    if (username) {
      const safeUsername = _.escapeRegExp(username);
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${safeUsername}$`, "i") },
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Username already taken" });
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        age: user.age,
        bio: user.bio,
        picture: user.picture,
        role: user.role,
        completedPrograms: user.completedPrograms,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
