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

    const perms = room?.joinPermissions || [];
    if (room?.allowGuestUsers) return true;
    if (!perms || perms.length === 0) return true;

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
                Live Conversations
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Step into the room.
                <span className="block text-[#076d47]">Join conversations live.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Discover rooms for your interests. Join the people of obrive and other community members. The rooms update regularly based on new happenings, events, and trending topics of the time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
              <div className="min-w-30 rounded-3xl border border-black/10 bg-white/75 px-4 py-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black">{liveCount}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Live now</div>
              </div>
              <div className="min-w-30 rounded-3xl border border-black/10 bg-white/75 px-4 py-4 shadow-sm backdrop-blur">
                <div className="text-2xl font-black">{allowedCount}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">Available for you</div>
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

      {/* Main Container Area */}
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
          /* RESPONSIVE CARD ENGINE: 1 column on mobile, 2 columns on medium/desktop viewports */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="group flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white/90 p-5 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-black/[0.15]"
                >
                  <div>
                    {/* Upper Metadata Row */}
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#076d47] text-sm font-bold text-white shadow-sm">
                        {initials || "R"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-[#076d47] transition-colors line-clamp-1">
                          {label}
                        </h3>
                        
                        {room.roomDescription ? (
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                            {room.roomDescription}
                          </p>
                        ) : (
                          <p className="mt-1.5 text-xs italic text-slate-400">
                            No layout logging details provided for this active broadcast space.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badge System Logs */}
                    <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                      <span className="rounded-md border border-black/[0.06] bg-slate-50/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Room #{room.id}
                      </span>
                      {room.roomType && (
                        <span className="rounded-md border border-black/[0.06] bg-slate-50/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {room.roomType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operational Action Footer Layer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Access: <span className={allowed ? "text-[#076d47]" : "text-slate-500"}>{allowed ? "Open" : "Restricted"}</span>
                    </div>

                    {allowed ? (
                      <Link href={`/audio-room/room/${room.id}`} className="shrink-0">
                        <Button
                          size="sm"
                          className="rounded-lg bg-[#076d47] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#055c3c] active:scale-98"
                        >
                          Join Room
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="rounded-lg border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-400 cursor-not-allowed"
                      >
                        Unavailable
                      </Button>
                    )}
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


