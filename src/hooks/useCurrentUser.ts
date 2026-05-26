"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface CurrentUser {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  userid?: string;
  status?: string;
  is_active?: boolean;
}

export function useCurrentUser() {
  const [me, setMe] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch("/auth/me");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch current user");
      }

      setMe(data.data || null);
    } catch (error) {
      setMe(null);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    me,
    loading,
    error,
    refetch: fetchCurrentUser,
  };
}

//this hook can be used in any component to get the current user's info, loading state, and error state. It also provides a refetch function to manually refresh the user data if needed.
//it is used by components that need to know the current user's info, such as the navbar, profile page, or any page that requires authentication. It abstracts away the logic of fetching the user data and handling token refresh, making it easy to use across the app.
//it is different from api.ts in that it is a React hook specifically for managing the current user's state, while api.ts provides a general-purpose function for making API calls with automatic token refresh handling.
//example usage: const { me, loading, error } = useCurrentUser(); in a component to get the current user's info and display it.
