const express = require("express");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");
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

    // Validate that incoming values are primitives, not objects/query operators
    if (name !== undefined && typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid name" });
    }
    if (
      username !== undefined &&
      username !== null &&
      typeof username !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username" });
    }
    if (age !== undefined) {
      // allow empty string (handled below), number, or numeric string
      if (
        typeof age !== "number" &&
        typeof age !== "string"
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid age" });
      }
      if (age !== "" && Number.isNaN(Number(age))) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid age" });
      }
    }
    if (bio !== undefined && typeof bio !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid bio" });
    }
    if (picture !== undefined && typeof picture !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid picture" });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (username !== undefined) updateData.username = username || undefined;
    if (age !== undefined) updateData.age = age === "" ? null : Number(age);
    if (bio !== undefined) updateData.bio = bio;
    if (picture) updateData.picture = picture;

    // Check if username is already taken (case-insensitive)
    if (username) {
      const existingUser = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
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
