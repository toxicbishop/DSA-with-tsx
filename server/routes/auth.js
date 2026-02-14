const express = require("express");
const { validationResult, body } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.router ? express.Router() : express(); // Standard way: express.Router()

// Fix: router is returned by express.Router()
const api = express.Router();

// Register User
api.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      user = await User.create({
        name,
        email,
        password,
      });

      sendTokenResponse(user, 201, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

// Login User
api.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check for user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      sendTokenResponse(user, 200, res);
    } catch (err) {
      console.error(err); // Log error
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

// Get Current Logged in User
api.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// Log user out / clear cookie
api.get("/logout", (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

// Get token from model, create cookie and send response
// Get token from model, create cookie and send response
function sendTokenResponse(user, statusCode, res) {
  // Create token
  // Use JWT_SECRET from env or default
  const secret = process.env.JWT_SECRET || "secret";
  const expire = process.env.JWT_EXPIRE || "30d";

  const token = require("jsonwebtoken").sign({ id: user._id }, secret, {
    expiresIn: expire,
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
}

module.exports = api;
