const { encrypt, decrypt } = require("../utils/cookieCrypto");

describe("cookieCrypto", () => {
  it("encrypts and decrypts a string correctly", () => {
    const original = "test-jwt-token-value";
    const encrypted = encrypt(original);
    expect(encrypted).not.toBe(original);
    expect(decrypt(encrypted)).toBe(original);
  });

  it("produces different ciphertexts for the same input (random IV)", () => {
    const original = "same-input";
    const a = encrypt(original);
    const b = encrypt(original);
    expect(a).not.toBe(b);
    // But both decrypt to the same value
    expect(decrypt(a)).toBe(original);
    expect(decrypt(b)).toBe(original);
  });

  it("returns null for invalid encrypted text", () => {
    expect(decrypt("invalid")).toBeNull();
    expect(decrypt("not:valid:hex")).toBeNull();
    expect(decrypt("")).toBeNull();
  });

  it("handles empty string encryption", () => {
    const encrypted = encrypt("");
    expect(decrypt(encrypted)).toBe("");
  });

  it("handles special characters", () => {
    const original = '{"userId":"123","role":"admin"}';
    const encrypted = encrypt(original);
    expect(decrypt(encrypted)).toBe(original);
  });
});
