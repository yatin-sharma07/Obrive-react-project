"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function RoomsPage() {
  const { me, loading: userLoading } = useCurrentUser();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    // If no join permissions defined, allow by default
    const perms = room?.joinPermissions || [];

    // allow if allowGuestUsers is true
    if (room?.allowGuestUsers) return true;

    if (!perms || perms.length === 0) return true;

    const userRole = me?.role || "";

    // check for explicit allow for user's crmRole
    return perms.some((p: any) => {
      const crm = p?.crmRole;
      if (!crm) return false;
      const crmLower = String(crm).toLowerCase();
      if (crmLower === "all" || crmLower === "everyone") return true;
      return userRole && String(userRole).toLowerCase() === crmLower;
    });
  };

  if (loading || userLoading) {
    return (
      <div className="p-8">
        <div>Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Live Rooms</h1>

      {error && (
        <div className="text-sm text-red-600 mb-4">{error}</div>
      )}

      {rooms.length === 0 && (
        <div className="text-sm text-slate-600">No live rooms available.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {rooms.map((room) => {
          const allowed = canUserJoin(room);

          return (
            <div
              key={room.id}
              className="border rounded-md p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium">{room.roomName || room.name || `Room ${room.id}`}</div>
                  {room.roomDescription && (
                    <div className="text-sm text-slate-600 mt-1">{room.roomDescription}</div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-slate-500">Status: {room.roomStatus}</div>

                  {allowed ? (
                    <Link href={`/audio-room/room/${room.id}`}>
                      <Button size="sm">Join</Button>
                    </Link>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Not allowed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
