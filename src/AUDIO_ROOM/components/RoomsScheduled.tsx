"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/lib/api";

// ======================================================
// UI CLASSES
// ======================================================

const sectionClass =
  "rounded-[5px] border border-slate-200/70 bg-white/40 backdrop-blur-[10px] p-3 shadow-[10px]";

const buttonClass =
  "rounded-[5px] border border-slate-200 bg-slate-900 px-2 py-1 text-[8px] font-medium text-white transition hover:opacity-90";

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

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [loading, setLoading] =
    useState(false);

  // ======================================================
  // FETCH
  // ======================================================

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms =
    async () => {
      try {
        setLoading(true);

        const response =
          await apiFetch(
            "/audio-room/rooms"
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        const scheduledRooms =
          (
            data.data || []
          ).filter(
            (room: Room) =>
              room.roomStatus ===
              "scheduled"
          );

        setRooms(
          scheduledRooms
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  // ======================================================
  // ACTIONS
  // ======================================================

  const handleGenerateLink =
    (roomId: number) => {
      console.log(
        "Generate Link:",
        roomId
      );
    };

  const handleSendNotification =
    (roomId: number) => {
      console.log(
        "Send Notification:",
        roomId
      );
    };

const handleStartNow =
  async (
    roomId: number
  ) => {
    try {
      const response =
        await apiFetch(
          "/audio-room/start-room",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  roomId,
                }
              ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message ||
            "Failed to start room"
        );
      }

      console.log(
        "✅ Room Started:",
        data
      );

      // Refresh list
      fetchRooms();
    } catch (
      error
    ) {
      console.error(
        "❌ Error starting room:",
        error
      );
    }
  };
  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="w-full h-full overflow-y-auto">
      <section className={sectionClass}>
        <h2 className="text-[11px] font-semibold text-slate-800">
          Scheduled Rooms
        </h2>

        <p className="mb-4 mt-1 text-[9px] text-slate-500">
          Upcoming scheduled rooms.
        </p>

        {loading && (
          <p className="text-[9px] text-slate-500">
            Loading...
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-[5px] border border-slate-200 bg-white/50 p-2 shadow-[10px]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[10px] font-semibold text-slate-800">
                    {room.roomName}
                  </h3>

                  <p className="mt-1 text-[8px] text-slate-500">
                    {room.roomDescription}
                  </p>
                </div>

                <div className="rounded-[5px] bg-yellow-100 px-1.5 py-0.5 text-[7px] text-yellow-700">
                  scheduled
                </div>
              </div>

              <div className="mt-2 space-y-1 text-[8px] text-slate-600">
                <p>
                  <span className="font-medium">
                    Limit:
                  </span>{" "}
                  {
                    room.participantLimit
                  }
                </p>

                <p>
                  <span className="font-medium">
                    Visibility:
                  </span>{" "}
                  {room.visibility}
                </p>

                <p>
                  <span className="font-medium">
                    Start:
                  </span>{" "}
                  {room.startTime
                    ? new Date(
                        room.startTime
                      ).toLocaleString()
                    : "Not set"}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    handleGenerateLink(
                      room.id
                    )
                  }
                  className={
                    buttonClass
                  }
                >
                  Link
                </button>

                <button
                  onClick={() =>
                    handleSendNotification(
                      room.id
                    )
                  }
                  className="rounded-[5px] border border-slate-200 bg-white px-2 py-1 text-[8px] text-slate-700"
                >
                  Notify
                </button>

                <button
                  onClick={() =>
                    handleStartNow(
                      room.id
                    )
                  }
                  className="rounded-[5px] border border-slate-200 bg-green-600 px-2 py-1 text-[8px] text-white"
                >
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ScheduledRooms;
