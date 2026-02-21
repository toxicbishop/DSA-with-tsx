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
      { completedPrograms },
      { new: true },
    );

    res.json({ success: true, completedPrograms: user.completedPrograms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
