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

  let response = await fetch(url, defaultOptions);

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
