import { getCsrfToken } from "./csrf";

export async function secureFetch(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": getCsrfToken() || "",
      ...options.headers,
    },
  };

  console.log(`[secureFetch] Requesting: ${url}`, defaultOptions);
  let response;
  try {
    response = await fetch(url, defaultOptions);
  } catch (err) {
    console.error(`[secureFetch] Fetch failed for ${url}:`, err);
    throw err;
  }

  // If unauthorized, attempt to refresh the token
  if (response.status === 403 || response.status === 401) {
    const refreshRes = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
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
      response = await fetch(url, defaultOptions);
    }
  }

  return response;
}
