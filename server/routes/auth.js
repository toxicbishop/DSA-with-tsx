const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
const { verifyToken } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const { encrypt } = require("../utils/cookieCrypto");
const crypto = require("crypto");
const { sendEmailEvent, produceUserStat } = require("../utils/kafka");

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
    // NoSQL Injection Protection: Ensure email is a string
    let user = await User.findOne({ email: String(email) });
    if (!user) {
      user = await User.create({ googleId, email, name, picture });
    } else {
      user.googleId = googleId;
      user.picture = picture;
      user.name = name;
      await user.save();
    }

    issueTokens(user, res);

    // Analytics: Produce login stat
    produceUserStat({
      type: "USER_LOGIN",
      provider: "GOOGLE",
      userId: user._id,
      email: user.email,
    });

    return res.status(200).json({
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
      message: "Login successful",
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid Google token" });
  }
});

router.all("/github", authLimiter, async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET")
    return res.status(405).end();
  try {
    const code = req.method === "GET" ? req.query.code : req.body.code;
    if (!code) {
      if (req.method === "GET")
        return res.redirect(
          (process.env.FRONTEND_URL || "http://localhost:5173") +
            "/?error=missing_code",
        );
      return res.status(400).json({ success: false, message: "Code missing" });
    }

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
    // NoSQL Injection Protection: Ensure email is a string
    let user = await User.findOne({ email: String(primaryEmail) });
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

    // Analytics: Produce login stat
    produceUserStat({
      type: "USER_LOGIN",
      provider: "GITHUB",
      userId: user._id,
      email: user.email,
    });

    if (req.method === "GET") {
      return res.redirect(process.env.FRONTEND_URL || "http://localhost:5173/");
    }

    return res.status(200).json({
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
      message: "Login successful",
    });
  } catch (error) {
    console.error("GitHub Auth Error:", error);
    if (req.method === "GET") {
      return res.redirect(
        (process.env.FRONTEND_URL || "http://localhost:5173") +
          "/?error=github_auth_failed",
      );
    }
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
        username: user.username,
        age: user.age,
        bio: user.bio,
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

      // Analytics: Produce registration stat
      produceUserStat({
        type: "USER_REGISTER",
        provider: "LOCAL",
        userId: user._id,
        email: user.email,
      });

      return res.status(200).json({
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

      // Analytics: Produce login stat
      produceUserStat({
        type: "USER_LOGIN",
        provider: "LOCAL",
        userId: user._id,
        email: user.email,
      });

      return res.status(200).json({
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

// ─── Password Reset ──────────────────────────────────────────────────────────
router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().normalizeEmail().withMessage("Invalid email")],
  async (req, res) => {
    const { email } = req.body;
    try {
      // NoSQL Injection Protection: Ensure email is a string
      const user = await User.findOne({ email: String(email) });
      if (!user) {
        // Return 200 for security to prevent email enumeration
        return res.status(200).json({
          success: true,
          message: "Check your email for a reset link.",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

      const message = `You requested a password reset. Click high-security link below to reset:\n\n${resetUrl}\n\nThis link expires in 10 minutes.`;

      try {
        await sendEmailEvent({
          email: user.email,
          subject: "Password Reset Request",
          message,
          html: `<p>You requested a password reset. Click the link below to reset:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 10 minutes.</p>`,
        });
        res.status(200).json({ success: true, message: "Email sent." });
      } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({ success: false, message: "Email failed." });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  },
);

router.post(
  "/reset-password/:token",
  authLimiter,
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6+ chars"),
  ],
  async (req, res) => {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired token." });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.tokenVersion += 1; // Revoke all old tokens
      await user.save();

      issueTokens(user, res);
      res.status(200).json({ success: true, message: "Password updated." });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  },
);

// ─── Magic Link (Continue with Email) ────────────────────────────────────────
router.post(
  "/magic-login",
  authLimiter,
  [body("email").isEmail().normalizeEmail()],
  async (req, res) => {
    const { email } = req.body;
    try {
      // NoSQL Injection Protection: Ensure email is a string
      const user = await User.findOne({ email: String(email) });
      if (!user) {
        // Create user if they don't exist
        user = await User.create({
          email,
          name: email.split("@")[0],
        });
      }

      const magicToken = crypto.randomBytes(32).toString("hex");
      user.magicLoginToken = crypto
        .createHash("sha256")
        .update(magicToken)
        .digest("hex");
      user.magicLoginExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      const magicUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/magic/${magicToken}`;

      await sendEmailEvent({
        email: user.email,
        subject: "Your Login Link",
        message: `Click here to log in: ${magicUrl}`,
        html: `<p>Click the link below to log in to DSA Study Hub:</p><a href="${magicUrl}">Login Now</a>`,
      });

      res.status(200).json({ success: true, message: "Check your email." });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  },
);

router.get("/magic/:token", async (req, res) => {
  try {
    const magicLoginToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      magicLoginToken,
      magicLoginExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid link." });
    }

    user.magicLoginToken = undefined;
    user.magicLoginExpire = undefined;
    await user.save();

    issueTokens(user, res);
    res.status(200).json({ success: true, message: "Logged in." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── Phone OTP (Continue with Phone) ─────────────────────────────────────────
router.post(
  "/phone-login",
  authLimiter,
  [body("phoneNumber").notEmpty().withMessage("Phone required")],
  async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      // NoSQL Injection Protection: Ensure phoneNumber is a string
      let user = await User.findOne({ phoneNumber: String(phoneNumber) });
      if (!user) {
        user = await User.create({
          phoneNumber,
          name: `User-${phoneNumber.slice(-4)}`,
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.phoneOTP = otp;
      user.phoneOTPExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
      await user.save();

      // MOCK SMS SENDING
      console.log(`[SMS MOCK] Sending OTP ${otp} to ${phoneNumber}`);

      res.status(200).json({
        success: true,
        message: "OTP sent (Mocked). Check console.",
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  },
);

router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    // NoSQL Injection Protection: Ensure input is a literal value
    const user = await User.findOne({
      phoneNumber: String(phoneNumber),
      phoneOTP: String(otp),
      phoneOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    user.phoneOTP = undefined;
    user.phoneOTPExpire = undefined;
    await user.save();

    issueTokens(user, res);
    res.status(200).json({ success: true, message: "Logged in." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
