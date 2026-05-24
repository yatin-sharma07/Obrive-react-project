"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface CurrentUser {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  userid?: string;
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
