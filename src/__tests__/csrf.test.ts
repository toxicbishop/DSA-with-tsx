import { describe, it, expect, beforeEach } from "vitest";
import { getCsrfToken } from "../utils/csrf";

describe("getCsrfToken", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  it("returns null when no XSRF-TOKEN cookie exists", () => {
    document.cookie = "";
    expect(getCsrfToken()).toBeNull();
  });

  it("extracts XSRF-TOKEN from a single cookie", () => {
    document.cookie = "XSRF-TOKEN=abc123";
    expect(getCsrfToken()).toBe("abc123");
  });

  it("extracts XSRF-TOKEN from multiple cookies", () => {
    document.cookie = "session=xyz; XSRF-TOKEN=token456; other=val";
    expect(getCsrfToken()).toBe("token456");
  });

  it("handles leading spaces in cookie values", () => {
    document.cookie = "other=val;  XSRF-TOKEN=spaced789";
    expect(getCsrfToken()).toBe("spaced789");
  });

  it("returns null when cookie name partially matches", () => {
    document.cookie = "NOT-XSRF-TOKEN=fake";
    expect(getCsrfToken()).toBeNull();
  });
});
