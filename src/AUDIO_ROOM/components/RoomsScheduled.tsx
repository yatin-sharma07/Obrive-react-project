"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// ======================================================
// FIXED: HIGH-PERFORMANCE MINIMALIST SOLID UI UTILITIES
// ======================================================
const sectionClass =
  "rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all";

const buttonClass =
  "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 cursor-pointer";

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
    let isMounted = true;
    
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/audio-room/rooms");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch panels");
        }

        if (isMounted) {
          const scheduledRooms = (data.data || []).filter(
            (room: Room) => room.roomStatus === "scheduled"
          );
          setRooms(scheduledRooms);
        }
      } catch (error) {
        console.error("❌ Error fetching panels:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRooms();
    return () => { isMounted = false; };
  }, []);

  // Structural re-fetch trigger helper
  const refreshRoomsList = async () => {
    try {
      const response = await apiFetch("/audio-room/rooms");
      const data = await response.json();
      if (response.ok) {
        const scheduledRooms = (data.data || []).filter(
          (room: Room) => room.roomStatus === "scheduled"
        );
        setRooms(scheduledRooms);
      }
    } catch (error) {
      console.error(error);
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
      refreshRoomsList();
    } catch (error) {
      console.error("❌ Error starting room:", error);
    }
  };

  // ======================================================
  // RETURN
  // ======================================================
  return (
    <div className="w-full h-full overflow-y-auto p-2 bg-[#f8f9fa]">
      <section className={sectionClass}>
        {/* Section Header */}
        <div className="mb-5">
          <h2 className="text-sm font-bold tracking-tight text-slate-800">
            Scheduled Planning Panels
          </h2>
          <p className="text-[9px] text-slate-400 mt-0.5">
            Upcoming timeline rooms curated by the community hosts.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-xs text-slate-500 animate-pulse flex items-center gap-2 mb-4">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            Fetching scheduled timeline...
          </div>
        )}

        {/* Rooms Grid Splitter */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!loading && rooms.length === 0 ? (
            <div className="col-span-full py-10 text-center rounded-md border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-xs text-slate-400 italic">No scheduled rooms found.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  {/* Card Title & Status Tag Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[11px] font-bold tracking-tight text-slate-800 truncate" title={room.roomName}>
                      {room.roomName}
                    </h3>
                    <div className="shrink-0 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                      Scheduled
                    </div>
                  </div>

                  {/* Description Context Block */}
                  <p className="mt-2 mb-4 text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {room.roomDescription || "No description provided for this event."}
                  </p>
                </div>

                {/* Meta Attributes Panel Footer */}
                <div className="mt-auto border-t border-slate-100 pt-3">
                  <div className="grid grid-cols-2 gap-y-1.5 text-[9px] text-slate-500 mb-3.5">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-400">Limit:</span>
                      <span className="font-bold text-slate-600">{room.participantLimit} slots</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="font-semibold text-slate-400">Access:</span>
                      <span className="capitalize font-bold text-slate-600">{room.visibility}</span>
                    </div>
                    
                    <div className="col-span-full flex flex-col gap-0.5 mt-1 rounded bg-slate-50 p-2 border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Target Start Time
                      </span>
                      <span className="font-bold text-slate-700">
                        {room.startTime
                          ? new Date(room.startTime).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Not configured"}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Control Blocks */}
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
                      className="rounded-md bg-slate-900 px-3 py-1.5 text-[9px] font-bold text-white transition-colors hover:bg-slate-800 ml-auto cursor-pointer"
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