const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
// Key must be 32 bytes for aes-256-cbc
// We'll hash the provided secret to ensure it's the right length
const getSecretKey = () => {
  const secret =
    process.env.COOKIE_SECRET ||
    "fallback_cookie_secret_at_least_32_chars_long";
  return crypto.createHash("sha256").update(secret).digest();
};

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) return null;
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return null;
  }
};

module.exports = { encrypt, decrypt };
