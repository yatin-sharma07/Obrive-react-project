"use client";

import { ReactNode, useState } from "react";
import { SocketProvider } from "@/context/SocketContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Michroma } from "next/font/google";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

interface AudioRoomLayoutProps {
  children: ReactNode;
}

export default function AudioRoomLayout({
  children,
}: AudioRoomLayoutProps) {
  const { me, loading, refetch } = useCurrentUser();
  const isBlocked = me?.is_active === false || me?.status === "inactive";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      setError("");

      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data?.data?.accessToken) {
        localStorage.setItem("token", data.data.accessToken);
      }

      if (data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      await refetch();
    } catch (loginError: any) {
      setError(loginError?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`${michroma.className} min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(7,109,71,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-950`}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-[28px] border border-black/10 bg-white/90 px-8 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur">
            <div className="text-lg font-semibold tracking-tight">
              Loading room...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div
        className={`${michroma.className} min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(7,109,71,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-950`}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[28px] border border-black/10 bg-white/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur">
            <div className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Access blocked
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight">
              Your account is inactive
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Please contact an administrator before trying to join audio rooms again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div
        className={`${michroma.className} min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(7,109,71,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-950`}
      >
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-[28px] border border-black/10 bg-white/92 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)] backdrop-blur">
            <div className="inline-flex rounded-full border border-[#076d47]/15 bg-[#076d47]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#076d47]">
              Login required
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight">
              Enter the room
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sign in to continue to the audio room. You will stay on this page after login.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="room-email">Email</Label>
                <Input
                  id="room-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="mt-2 border-black/10 bg-white"
                />
              </div>

              <div>
                <Label htmlFor="room-password">Password</Label>
                <Input
                  id="room-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="mt-2 border-black/10 bg-white"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="button"
                onClick={handleLogin}
                disabled={submitting}
                className="w-full rounded-full bg-[#076d47] py-6 text-white hover:bg-[#055c3c]"
              >
                {submitting ? "Logging in..." : "Log in and enter"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className={`${michroma.className} min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(7,109,71,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.06),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-950`}>
        {children}
      </div>
    </SocketProvider>
  );
}
