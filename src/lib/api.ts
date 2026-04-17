
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  retry?: boolean;
};

export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {}
) {
  const { retry = true, ...rest } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
  });

  //  If access token expired (usually 401)
  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Retry original request ONCE
      return apiFetch(endpoint, { ...options, retry: false });
    } else {
    
      return Promise.reject("Session expired");
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

    //  backend set new access token cookie
    return true;
  } catch (error) {
    return false;
  }
}