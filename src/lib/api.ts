
// Base API URL already includes /api
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Export for use in components (already includes /api)
export const API_BASE_URL = BASE_URL;

type FetchOptions = RequestInit & {
  retry?: boolean;
};

export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {}
) {
  const { retry = true, ...rest } = options;

  // Get token from localStorage for fallback if cookie is not sent/working
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("accessToken")
      : null;
  const headers = new Headers(rest.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    cache: "no-store",
    credentials: "include", 
    headers,
  });

  //  If access token expired (usually 401)
  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Retry original request ONCE
      return apiFetch(endpoint, { ...options, retry: false });
    } else {
    
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
      }

      return Promise.reject(new Error("Session expired"));
    }
  }

  return response;
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends refresh token cookie
    });

    if (!res.ok) return false;

    const data = await res.json().catch(() => null);

    if (
      typeof window !== "undefined" &&
      data?.data?.accessToken
    ) {
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("token", data.data.accessToken);
    }

    return true;
  } catch (error) {
    return false;
  }
}

//1. these functions are used in the app to make API calls with automatic token refresh handling.
//2. apiFetch is the main function that components will use to call APIs. It automatically includes the access token from localStorage (for fallback) and handles 401 responses by trying to refresh the token and retrying the request once.
//3. refreshAccessToken is a helper function that calls the refresh endpoint to get a new access token. It returns true if successful, false otherwise.

