const jwt = require("jsonwebtoken");
const { decrypt } = require("../utils/cookieCrypto");

const verifyToken = (req, res, next) => {
  const encryptedToken = req.signedCookies?.accessToken;

  if (!encryptedToken) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }

  const token = decrypt(encryptedToken);
  if (!token) {
    return res.status(403).json({ success: false, message: "Invalid session" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_super_secret",
    );
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
