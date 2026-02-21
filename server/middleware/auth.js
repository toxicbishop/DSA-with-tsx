const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.signedCookies?.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
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
