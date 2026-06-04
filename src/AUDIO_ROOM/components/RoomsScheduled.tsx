"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// ======================================================
// UI CLASSES
// ======================================================
const sectionClass =
  "rounded-xl border border-slate-200/60 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-xl p-5 shadow-sm transition-all duration-300";

const buttonClass =
  "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-800 active:scale-95 cursor-pointer";

// ======================================================
// TYPES
// ======================================================
interface Room {
  id: number;
  roomName: string;
  roomDescription?: string;
  roomStatus: string;
  startTime?: string;
  participantLimit: number;
  visibility: string;
}

// ======================================================
// COMPONENT
// ======================================================
const ScheduledRooms = () => {
  // ======================================================
  // STATE
  // ======================================================
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  // ======================================================
  // FETCH
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
        throw new Error(data.message);
      }

      const scheduledRooms = (data.data || []).filter(
        (room: Room) => room.roomStatus === "scheduled"
      );

      setRooms(scheduledRooms);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ACTIONS
  // ======================================================
  const handleGenerateLink = (roomId: number) => {
    console.log("Generate Link:", roomId);
  };

  const handleSendNotification = (roomId: number) => {
    console.log("Send Notification:", roomId);
  };

  const handleStartNow = async (roomId: number) => {
    try {
      const response = await apiFetch("/audio-room/start-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start room");
      }

      console.log("✅ Room Started:", data);
      fetchRooms();
    } catch (error) {
      console.error("❌ Error starting room:", error);
    }
  };

  // ======================================================
  // RETURN
  // ======================================================
  return (
    <div className="w-full h-full overflow-y-auto p-1">
      <section className={sectionClass}>
        {/* Section Header */}
        <div className="mb-4">
          <h2 className="text-base font-bold tracking-tight text-slate-800">
            Scheduled Planning Panels
          </h2>
          <p className="text-xs text-slate-400">
            Upcoming timeline rooms curated by the community hosts.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-xl border border-slate-200/60 bg-white/50 p-4 text-xs text-slate-500 animate-pulse flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            Fetching scheduled timeline...
          </div>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!loading && rooms.length === 0 ? (
            <div className="col-span-full py-8 text-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/30">
              <p className="text-xs text-slate-400">No scheduled rooms found.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] hover:shadow-[0_8px_30px_-4px_rgba(148,163,184,0.2)] transition-all duration-300 hover:-translate-y-0.5 ring-1 ring-white/20"
              >
                <div>
                  {/* Card Title & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold tracking-tight text-slate-800 line-clamp-1">
                      {room.roomName}
                    </h3>
                    <div className="rounded-full border border-amber-200/60 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                      Scheduled
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-2 mb-4 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                    {room.roomDescription || "No description provided for this event."}
                  </p>
                </div>

                {/* Meta Attributes */}
                <div className="mt-auto border-t border-slate-100/80 pt-3">
                  <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-slate-400">Limit:</span>
                      <span className="font-medium text-slate-700">{room.participantLimit} slots</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="font-medium text-slate-400">Access:</span>
                      <span className="capitalize font-medium text-slate-700">{room.visibility}</span>
                    </div>
                    <div className="col-span-full flex flex-col gap-0.5 mt-1 rounded-lg bg-slate-50 p-2 border border-slate-100">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        Target Start Time
                      </span>
                      <span className="font-semibold text-slate-700">
                        {room.startTime
                          ? new Date(room.startTime).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Not configured"}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Action Blocks */}
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleGenerateLink(room.id)}
                      className={buttonClass}
                      title="Copy invite link"
                    >
                      Invite Link
                    </button>

                    <button
                      onClick={() => handleSendNotification(room.id)}
                      className={buttonClass}
                    >
                      Notify
                    </button>

                    <button
                      onClick={() => handleStartNow(room.id)}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-sm active:scale-95 ml-auto cursor-pointer"
                    >
                      Start Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ScheduledRooms;