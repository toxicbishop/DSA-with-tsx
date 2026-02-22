const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const { verifyToken } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const { encrypt } = require("../utils/cookieCrypto");

const router = express.Router();

const CLIENT_ID =
  process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "fallback_refresh_secret";

const issueTokens = (user, res) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    REFRESH_SECRET,
    { expiresIn: "14d" },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    signed: true,
  };

  res.cookie("accessToken", encrypt(accessToken), {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie("refreshToken", encrypt(refreshToken), {
    ...cookieOptions,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  });
};

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

    issueTokens(user, res);

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
    issueTokens(user, res);

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

router.post(
  "/register",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().escape().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      // NoSQL Injection Protection: Ensure email is a string
      let user = await User.findOne({ email: String(email) });
      if (user)
        return res.status(400).json({
          success: false,
          message: "Email already exists. Try logging in instead.",
        });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      issueTokens(user, res);

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
        message: "Registered securely",
      });
    } catch (error) {
      console.error("Local register error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      // NoSQL Injection Protection: Ensure email is a string
      const user = await User.findOne({ email: String(email) });
      if (!user || !user.password)
        return res.status(400).json({
          success: false,
          message: "Invalid credentials or you use OAuth",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });

      issueTokens(user, res);

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
        message: "Logged in securely",
      });
    } catch (error) {
      console.error("Local login error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
);

router.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    signed: true,
  };
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

router.post("/refresh", async (req, res) => {
  const { decrypt } = require("../utils/cookieCrypto");
  const encryptedToken = req.signedCookies?.refreshToken;

  if (!encryptedToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token missing" });
  }

  const token = decrypt(encryptedToken);
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(403).json({ success: false, message: "Token revoked" });
    }

    issueTokens(user, res);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
});

module.exports = router;
