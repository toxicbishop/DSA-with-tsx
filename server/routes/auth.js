const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

const CLIENT_ID =
  process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, try again later.",
  },
});

router.post("/google", authLimiter, async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
    } else {
      user.googleId = googleId;
      user.picture = picture;
      user.name = name;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        completedPrograms: user.completedPrograms,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid Google token" });
  }
});

router.post("/github", authLimiter, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code)
      return res.status(400).json({ success: false, message: "Code missing" });

    // 1. Exchange the code for an Access Token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );
    const { access_token } = await tokenResponse.json();
    if (!access_token)
      return res
        .status(401)
        .json({ success: false, message: "Invalid GitHub code" });

    // 2. Ask GitHub for the User's Profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const githubUser = await userResponse.json();

    // 3. Ask GitHub for the User's Email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const emails = await emailResponse.json();
    const primaryEmail =
      emails.find((e) => e.primary)?.email || githubUser.email;

    if (!primaryEmail)
      return res
        .status(400)
        .json({ success: false, message: "GitHub email missing" });

    // 4. Do exactly what we did for Google!
    let user = await User.findOne({ email: primaryEmail });
    if (!user) {
      user = await User.create({
        googleId: githubUser.node_id, // we could add githubId to schema, but as a shortcut we use node_id
        email: primaryEmail,
        name: githubUser.name || githubUser.login,
        picture: githubUser.avatar_url,
      });
    } else {
      user.picture = githubUser.avatar_url;
      user.name = githubUser.name || githubUser.login;
      await user.save();
    }

    // 5. Issue the exact same HttpOnly JWT Cookie
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        completedPrograms: user.completedPrograms,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during GitHub login" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        completedPrograms: user.completedPrograms,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
