import { getCsrfToken } from "./csrf";

export async function secureFetch(url: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    "X-XSRF-TOKEN": getCsrfToken() || "",
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  // Normalize the base API URL and resolve the requested URL against it
  let requestUrl: string;
  try {
    if (url.startsWith("/")) {
      if (!rawApiUrl) {
        throw new Error("Base API URL is not configured.");
      }
      const base = new URL(rawApiUrl);
      requestUrl = new URL(url, base).toString();
    } else {
      const parsed = new URL(url, rawApiUrl || undefined);
      requestUrl = parsed.toString();
    }
  } catch (e) {
    console.error("[secureFetch] Invalid URL provided:", url, e);
    throw new Error("Invalid URL for secureFetch.");
  }

  // Security: Prevent sending credentials and tokens to unintended hostnames
  try {
    if (!rawApiUrl) {
      throw new Error("Base API URL is not configured.");
    }
    const allowedOrigin = new URL(rawApiUrl).origin;
    const targetOrigin = new URL(requestUrl).origin;
    if (allowedOrigin !== targetOrigin) {
      console.error(
        `[secureFetch] Blocked unintended cross-origin fetch: ${requestUrl} (allowed origin: ${allowedOrigin}, target origin: ${targetOrigin})`,
      );
      throw new Error("Cross-origin fetch with secureFetch is forbidden.");
    }
  } catch (e) {
    if (e instanceof Error && e.message === "Cross-origin fetch with secureFetch is forbidden.") {
      throw e;
    }
    console.error("[secureFetch] Failed to validate URL origin:", url, e);
    throw new Error("Invalid URL for secureFetch.");
  }

  const defaultOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers,
  };

  console.log(`[secureFetch] Requesting: ${requestUrl}`, defaultOptions);
  let response;
  try {
    response = await fetch(requestUrl, defaultOptions);
  } catch (err) {
    console.error("[secureFetch] Fetch failed for URL:", requestUrl, err);
    throw err;
  }

  // If unauthorized, attempt to refresh the token
  if (response.status === 403 || response.status === 401) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": getCsrfToken() || "",
        },
      },
    );

    if (refreshRes.ok) {
      // Retry the original request
      response = await fetch(requestUrl, defaultOptions);
    }
  }

  return response;
}
