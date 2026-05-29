"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function CommunityRooms() { 
  const { me, loading: userLoading } = useCurrentUser();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiFetch("/audio-room/rooms");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load rooms");
        }

        // only live rooms
        const liveRooms = (data?.data || []).filter(
          (r: any) => String(r.roomStatus).toLowerCase() === "live"
        );

        setRooms(liveRooms);
      } catch (err: any) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const canUserJoin = (room: any) => {
    const userId = Number(me?.id);
    const userRole = String(me?.role || "").toLowerCase();

    if (userRole === "admin") return true;

    if (room?.createdBy != null && Number(room.createdBy) === userId) {
      return true;
    }

    // If no join permissions defined, allow by default
    const perms = room?.joinPermissions || [];

    // allow if allowGuestUsers is true
    if (room?.allowGuestUsers) return true;

    if (!perms || perms.length === 0) return true;

    // check for explicit allow for user's crmRole
    return perms.some((p: any) => {
      const crm = p?.crmRole;
      if (!crm) return false;
      const crmLower = String(crm).toLowerCase();
      if (crmLower === "all" || crmLower === "everyone") return true;
      return userRole && String(userRole).toLowerCase() === crmLower;
    });
  };

  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    const roomName = String(room.roomName || room.name || "").toLowerCase();
    const roomDescription = String(room.roomDescription || "").toLowerCase();

    return roomName.includes(term) || roomDescription.includes(term);
  });

  const liveCount = rooms.length;
  const allowedCount = rooms.filter(canUserJoin).length;

  if (loading || userLoading) {
    return (
      <div className="min-h-[70vh] bg-[#f6f0e7] px-4 py-10 sm:px-8 lg:px-12 col-span-3">
        <div className="mx-auto flex max-w-6xl items-center justify-center rounded-4xl border border-black/10 bg-white/80 px-6 py-20 shadow-[0_30px_80px_rgba(0,0,0,0.06)] backdrop-blur">
          <div className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full border border-black/10 bg-black/5" />
            <div className="text-lg font-semibold tracking-tight text-slate-900">
              Finding live rooms
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Loading rooms that match your role...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f0e7] text-slate-950">
      <div className="relative overflow-hidden border-b border-black/5 bg-[#f6f0e7]">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_top_left,rgba(7,109,71,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(7,109,71,0.12),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#076d47] shadow-sm backdrop-blur">
                Live audio lobby
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Step into the room.
                <span className="block text-[#076d47]">Join conversations live.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Discover active rooms available to your role, then jump in with one tap. The lobby updates in real time and only surfaces rooms you can access.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="min-w-30 rounded-3xl border border-black/10 bg-white/75 px-4 py-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black">{liveCount}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Live now</div>
              </div>
              <div className="min-w-30 rounded-3xl border border-black/10 bg-white/75 px-4 py-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black">{allowedCount}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">For your role</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-xl rounded-full border border-black/10 bg-white/85 px-5 py-3 shadow-sm backdrop-blur">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search rooms by name or topic"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2">Curated for you</span>
              <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2">Live only</span>
              <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2">Tap to join</span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        {filteredRooms.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-black/10 bg-white/70 px-6 py-16 text-center shadow-[0_30px_80px_rgba(0,0,0,0.05)] backdrop-blur">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#076d47]/10 text-2xl font-black text-[#076d47]">
              0
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              No rooms match right now
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              {searchTerm.trim()
                ? "Try a different search term or clear the filter to see every room you can join."
                : "There are currently no live rooms available for your role."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRooms.map((room) => {
              const allowed = canUserJoin(room);
              const label = room.roomName || room.name || `Room ${room.id}`;
              const initials = label
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part: string) => part[0]?.toUpperCase())
                .join("");

              return (
                <div
                  key={room.id}
                  className="group rounded-[28px] border border-black/10 bg-white/85 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.1)] sm:p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#076d47] text-lg font-black text-white shadow-lg shadow-[#076d47]/20">
                        {initials || "R"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                            {label}
                          </div>
                          <span className="rounded-full bg-[#076d47]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#076d47]">
                            Live
                          </span>
                        </div>

                        {room.roomDescription && (
                          <div className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            {room.roomDescription}
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1">
                            Room #{room.id}
                          </span>
                          {room.roomType && (
                            <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1">
                              {room.roomType}
                            </span>
                          )}
                          <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1">
                            Status: {String(room.roomStatus).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:items-end md:text-right">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {allowed ? "Open to you" : "Restricted"}
                      </div>

                      {allowed ? (
                        <Link href={`/audio-room/room/${room.id}`}>
                          <Button
                            size="lg"
                            className="rounded-full bg-[#076d47] px-6 text-white shadow-lg shadow-[#076d47]/20 transition hover:bg-[#055c3c]"
                          >
                            Join room
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="lg"
                          variant="outline"
                          disabled
                          className="rounded-full border-black/10 bg-white/70 px-6 text-slate-400"
                        >
                          Not allowed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
