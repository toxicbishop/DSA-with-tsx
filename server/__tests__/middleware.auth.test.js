const jwt = require("jsonwebtoken");
const { encrypt } = require("../utils/cookieCrypto");

// Mock process.env
process.env.JWT_SECRET = "test-jwt-secret";

const { verifyToken, requireAdmin } = require("../middleware/auth");

// Helper to create mock req/res/next
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("verifyToken middleware", () => {
  it("returns 401 when no accessToken cookie exists", () => {
    const req = { signedCookies: {} };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when token decryption fails", () => {
    const req = { signedCookies: { accessToken: "garbage" } };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and attaches user on valid token", () => {
    const payload = { id: "user1", email: "test@example.com", role: "user" };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const encryptedToken = encrypt(token);

    const req = { signedCookies: { accessToken: encryptedToken } };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: "user1", email: "test@example.com" });
  });

  it("returns 403 on expired token", () => {
    const token = jwt.sign(
      { id: "user1" },
      process.env.JWT_SECRET,
      { expiresIn: "-1s" }
    );
    const encryptedToken = encrypt(token);

    const req = { signedCookies: { accessToken: encryptedToken } };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("requireAdmin middleware", () => {
  it("returns 403 when user is not admin", () => {
    const req = { user: { role: "user" } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when user is admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when no user on request", () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
