"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ======================================================
// UI CLASSES
// ======================================================
const sectionClass =
  "rounded-xl border border-slate-200/60 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl p-5 shadow-sm transition-all duration-300";

const buttonClass =
  "rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-sm active:scale-95";

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
  // FETCH ROOMS
  // ======================================================
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/audio-room/rooms");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch rooms");
      }

      setRooms(data.data || []);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
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

      if (!data.data.allowed) {
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
    } catch (error) {
      console.error("❌ Join Error:", error);
      alert(error instanceof Error ? error.message : "Failed to join room");
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
      fetchRooms();
    } catch (error) {
      console.error("❌ Error ending room:", error);
    }
  };

  // ======================================================
  // ROOM CARD (ENHANCED VISUALS)
  // ======================================================
  const renderRoomCard = (room: Room) => {
    const isLive = room.roomStatus === "live";

    return (
      <div
        key={room.id}
        className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ring-1 ring-white/10 ${
          isLive
            ? "border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.15)] hover:shadow-[0_8px_30px_-4px_rgba(148,163,184,0.25)]"
            : "border-slate-100 bg-slate-50/40 opacity-80 hover:opacity-100 shadow-sm"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-tight text-slate-800 line-clamp-1">
              {room.roomName}
            </h3>

            {/* Badge Indicator */}
            <div
              className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                isLive
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                  : "bg-slate-100 text-slate-500 border border-slate-200/30"
              }`}
            >
              {isLive && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {room.roomStatus}
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 mb-4 line-clamp-2 text-xs text-slate-500 leading-relaxed">
            {room.roomDescription || "No description provided for this room."}
          </p>
        </div>

        {/* Technical Data & Metadata Details */}
        <div className="mt-auto border-t border-slate-100/80 pt-3">
          <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-400">Host:</span>
              <span className="font-medium text-slate-700 truncate max-w-[80px]">
                {room.creator?.name || "System"}
              </span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="font-medium text-slate-400">Limit:</span>
              <span className="font-medium text-slate-700">{room.participantLimit} slots</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-400">Type:</span>
              <span className="capitalize text-slate-600">{room.roomType || "Audio"}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <span className="font-medium text-slate-400">Access:</span>
              <span className="capitalize text-slate-600">{room.visibility}</span>
            </div>
          </div>

          {/* User Action Blocks */}
          <div className="mt-4 flex items-center justify-end gap-2">
            {isLive ? (
              <>
                <button
                  onClick={() => handleEndRoom(room.id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-medium text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-95"
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
              <button className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-800">
                View Archive
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ======================================================
  // RENDER MAIN MAIN CONTAINER
  // ======================================================
  return (
    <div className="w-full h-full overflow-y-auto p-1">
      <div className="flex flex-col gap-6">
        {/* Error Notification */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50/80 backdrop-blur-md p-3 text-xs text-red-700 flex items-center gap-2 shadow-sm">
            <span>❌</span> <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Loading Spinner Skeleton state */}
        {loading && (
          <div className="rounded-xl border border-slate-200/60 bg-white/50 p-4 text-xs text-slate-500 animate-pulse flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            Synchronizing room registers...
          </div>
        )}

        {/* Section: Live Rooms */}
        <section className={sectionClass}>
          <div className="mb-4">
            <h2 className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-2">
              Community Live Hub
              {liveRooms.length > 0 && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  {liveRooms.length} Active
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Real-time available conversation circles. Jump right in.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {liveRooms.length > 0 ? (
              liveRooms.map(renderRoomCard)
            ) : (
              <div className="col-span-full py-8 text-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/30">
                <p className="text-xs text-slate-400">No rooms are currently live.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section: Past Rooms */}
        <section className={sectionClass}>
          <div className="mb-4">
            <h2 className="text-base font-bold tracking-tight text-slate-800">
              History Logs
            </h2>
            <p className="text-xs text-slate-400">
              Review completed panel recordings and participant indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastRooms.length > 0 ? (
              pastRooms.map(renderRoomCard)
            ) : (
              <div className="col-span-full py-8 text-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/30">
                <p className="text-xs text-slate-400">No previous sessions found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomsHistory;