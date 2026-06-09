"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ======================================================
// HIGH-PERFORMANCE MINIMALIST SOLID UI UTILITIES
// ======================================================
const sectionClass =
  "rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all";

const buttonClass =
  "rounded-md bg-slate-900 px-3 py-1.5 text-[9px] font-semibold text-white transition-colors hover:bg-slate-800 cursor-pointer";

// ======================================================
// TYPES
// ======================================================
interface Room {
  id: number;
  roomName: string;
  roomDescription?: string;
  roomType: string;
  roomStatus: string;
  participantLimit: number;
  visibility: string;
  createdAt: string;
  creator?: {
    id: number;
    name: string;
    userid: string;
    role: string;
  };
}

// ======================================================
// COMPONENT
// ======================================================
const RoomsHistory = () => {
  const { me } = useCurrentUser();

  // ======================================================
  // STATE
  // ======================================================
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH ROOMS (WITH MOUNTED CLEANUP)
  // ======================================================
  useEffect(() => {
    let isMounted = true;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch("/audio-room/rooms");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch rooms");
        }

        if (isMounted) {
          setRooms(data.data || []);
        }
      } catch (err) {
        console.error("❌ Error loading registers:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  // Post-action soft structural data sync
  const refreshRoomsList = async () => {
    try {
      const response = await apiFetch("/audio-room/rooms");
      const data = await response.json();
      if (response.ok) {
        setRooms(data.data || []);
      }
    } catch (err) {
      console.error("❌ Sync Error:", err);
    }
  };

  // ======================================================
  // FILTERS
  // ======================================================
  const liveRooms = rooms.filter((room) => room.roomStatus === "live");
  const pastRooms = rooms.filter((room) => room.roomStatus === "ended");

  // ======================================================
  // JOIN ROOM
  // ======================================================
  const handleJoinRoom = async (roomId: number) => {
    try {
      const userId = me?.id;
      if (!userId) {
        alert("Please login before joining a room");
        return;
      }

      const response = await apiFetch("/audio-room/join", {
        method: "POST",
        body: JSON.stringify({ roomId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join room");
      }

      if (!data.data?.allowed) {
        alert("You don't have access to this room");
        return;
      }

      console.log("✅ Join Success:", data);

      sessionStorage.setItem(
        "audio-room-session",
        JSON.stringify({
          roomId,
          roomRole: data.data.roomRole,
        })
      );

      window.location.href = `/audio-room/room/${roomId}`;
    } catch (err) {
      console.error("❌ Join Error:", err);
      alert(err instanceof Error ? err.message : "Failed to join room");
    }
  };

  // ======================================================
  // END ROOM
  // ======================================================
  const handleEndRoom = async (roomId: number) => {
    try {
      if (!me?.id) return;

      const response = await apiFetch("/audio-room/end-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          userId: me.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to end room");
      }

      console.log("✅ Room Ended:", data);
      refreshRoomsList();
    } catch (err) {
      console.error("❌ Error ending room:", err);
    }
  };

  // ======================================================
  // ROOM CARD RENDERING BLOCK
  // ======================================================
  const renderRoomCard = (room: Room) => {
    const isLive = room.roomStatus === "live";

    return (
      <div
        key={room.id}
        className={`group relative flex flex-col justify-between rounded-lg border p-4 transition-all duration-200 ${
          isLive
            ? "border-slate-200 bg-white shadow-sm hover:border-slate-300"
            : "border-slate-200 bg-slate-50/60 opacity-85 hover:opacity-100"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[11px] font-bold tracking-tight text-slate-800 truncate" title={room.roomName}>
              {room.roomName}
            </h3>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                isLive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {isLive && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {room.roomStatus}
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 mb-4 text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
            {room.roomDescription || "No description provided for this room."}
          </p>
        </div>

        {/* Technical Data & Metadata Details */}
        <div className="mt-auto border-t border-slate-100 pt-3">
          <div className="grid grid-cols-2 gap-y-1.5 text-[9px] text-slate-500">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Host:</span>
              <span className="font-bold text-slate-600 truncate max-w-[85px]">
                {room.creator?.name || "System"}
              </span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="font-semibold text-slate-400">Limit:</span>
              <span className="font-bold text-slate-600">{room.participantLimit} slots</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-400">Type:</span>
              <span className="capitalize font-bold text-slate-500">{room.roomType || "Audio"}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="font-semibold text-slate-400">Access:</span>
              <span className="capitalize font-bold text-slate-500">{room.visibility}</span>
            </div>
          </div>

          {/* User Action Control Footer */}
          <div className="mt-4 flex items-center justify-end gap-2">
            {isLive ? (
              <>
                <button
                  onClick={() => handleEndRoom(room.id)}
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[9px] font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white cursor-pointer"
                >
                  End Room
                </button>
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  className={buttonClass}
                >
                  Join Live
                </button>
              </>
            ) : (
              <button className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 cursor-pointer">
                View Archive
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ======================================================
  // RENDER CONTAINER
  // ======================================================
  return (
    <div className="w-full h-full overflow-y-auto p-2 bg-[#f8f9fa]">
      <div className="flex flex-col gap-6">
        {/* Error Notification Banner */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[10px] text-red-700 flex items-center gap-2 shadow-sm">
            <span className="font-bold">❌ Error:</span> <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Loading Spinner Skeleton state */}
        {loading && (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-[10px] text-slate-500 animate-pulse flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            Synchronizing room registers...
          </div>
        )}

        {/* Section: Live Rooms */}
        <section className={sectionClass}>
          <div className="mb-5">
            <h2 className="text-sm font-bold tracking-tight text-slate-800 flex items-center gap-2">
              Community Live Hub
              {liveRooms.length > 0 && (
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-200/40">
                  {liveRooms.length} Active
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Real-time available conversation circles. Jump right in.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveRooms.length > 0 ? (
              liveRooms.map(renderRoomCard)
            ) : (
              <div className="col-span-full py-10 text-center rounded-md border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-[10px] text-slate-400 italic">No rooms are currently live.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section: Past Rooms */}
        <section className={sectionClass}>
          <div className="mb-5">
            <h2 className="text-sm font-bold tracking-tight text-slate-800">
              History Logs
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Review completed panel recordings and participant indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastRooms.length > 0 ? (
              pastRooms.map(renderRoomCard)
            ) : (
              <div className="col-span-full py-10 text-center rounded-md border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-[10px] text-slate-400 italic">No previous sessions found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomsHistory;