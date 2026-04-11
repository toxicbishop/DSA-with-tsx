import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock csrf module
vi.mock("../utils/csrf", () => ({
  getCsrfToken: vi.fn(() => "mock-csrf-token"),
}));

// Set env before importing
vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

describe("secureFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
  });

  it("blocks cross-origin requests", async () => {
    const { secureFetch } = await import("../utils/api");

    await expect(
      secureFetch("https://evil.example.com/steal")
    ).rejects.toThrow("Cross-origin fetch with secureFetch is forbidden.");
  });

  it("resolves relative URLs against the base API URL", async () => {
    const { secureFetch } = await import("../utils/api");

    await secureFetch("/api/test");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.com/api/test",
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          "X-XSRF-TOKEN": "mock-csrf-token",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("includes CSRF token in headers", async () => {
    const { secureFetch } = await import("../utils/api");

    await secureFetch("/api/data");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-XSRF-TOKEN": "mock-csrf-token",
        }),
      })
    );
  });

  it("attempts token refresh on 401 response", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 401 }) // original request
      .mockResolvedValueOnce({ ok: true, status: 200 }) // refresh call
      .mockResolvedValueOnce({ ok: true, status: 200 }); // retry

    globalThis.fetch = mockFetch;

    const { secureFetch } = await import("../utils/api");
    await secureFetch("/api/protected");

    // Should have called fetch 3 times: original, refresh, retry
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/api/auth/refresh",
      expect.objectContaining({ method: "POST", credentials: "include" })
    );
  });
});
