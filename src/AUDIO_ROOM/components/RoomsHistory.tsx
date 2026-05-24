"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { API_BASE_URL, apiFetch } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import livekitService from "@app/../../backend/src/modules/AUDIO_ROOM/livekit/services/livekit.service";

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
  const { me } =
    useCurrentUser();

  // ======================================================
  // STATE
  // ======================================================

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================================
  // FETCH ROOMS
  // ======================================================

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms =
    async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            `${API_BASE_URL}/audio-room/rooms`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch rooms"
          );
        }

        setRooms(data.data || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================================
  // FILTERS
  // ======================================================

  const liveRooms =
    rooms.filter(
      (room) =>
        room.roomStatus === "live"
    );

  const pastRooms =
    rooms.filter(
      (room) =>
        room.roomStatus === "ended"
    );

  // ======================================================
  // JOIN ROOM
  // ======================================================

      const handleJoinRoom =
        async (
          roomId: number
        ) => {
          try {
            const userId =
              me?.id;

            if (!userId) {
              alert(
                "Please login before joining a room"
              );

              return;
            }

            const response =
              await apiFetch(
                "/audio-room/join",
                {
                  method:
                    "POST",

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
                  "Failed to join room"
              );
            }

            // ACCESS DENIED
            if (
              !data.data.allowed
            ) {
              alert(
                "You don't have access to this room"
              );

              return;
            }

            console.log(
              "✅ Join Success:",
              data
            );

            // ==================================
            // CONNECT LIVEKIT
            // ==================================

            // await livekitService.connect({
            //   token:
            //     data.data.livekitToken,

            //   roomId:
            //     roomId.toString(),
            // });

            // STORE ROOM SESSION
            sessionStorage.setItem(
              "audio-room-session",
              JSON.stringify({
                roomId,
                roomRole:
                  data.data.roomRole,

                livekitToken:
                  data.data
                    .livekitToken,
              })
            );

          // REDIRECT TO ROOM
          window.location.href =
            `/audio-room/room/${roomId}`;
          } catch (
            error
          ) {
            console.error(
              "❌ Join Error:",
              error
            );

            alert(
              error instanceof
                Error
                ? error.message
                : "Failed to join room"
            );
          }
        };

  // ======================================================
  // END ROOM
  // ======================================================
const handleEndRoom =
  async (
    roomId: number
  ) => {
    try {
      if (!me?.id) {
        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/end-room`,
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
                  userId:
                    me.id,
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
            "Failed to end room"
        );
      }

      console.log(
        "✅ Room Ended:",
        data
      );

      // Refresh room list
      fetchRooms();
    } catch (
      error
    ) {
      console.error(
        "❌ Error ending room:",
        error
      );
    }
  };


  // ======================================================
  // ROOM CARD
  // ======================================================

  const renderRoomCard = (
    room: Room
  ) => {
    return (
      <div
        key={room.id}
        className="rounded-[5px] border border-slate-200 bg-white/50 p-2 shadow-[10px]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[10px] font-semibold text-slate-800">
              {room.roomName}
            </h3>

            <p className="mt-1 line-clamp-2 text-[8px] text-slate-500">
              {room.roomDescription ||
                "No description"}
            </p>
          </div>

          <div
            className={`rounded-[5px] px-1.5 py-0.5 text-[7px] font-medium ${
              room.roomStatus ===
              "live"
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {room.roomStatus}
          </div>
        </div>

        {/* Details */}
        <div className="mt-2 space-y-1 text-[8px] text-slate-600">
          <p>
            <span className="font-medium">
              Creator:
            </span>{" "}
            {room.creator?.name ||
              "Unknown"}
          </p>

          <p>
            <span className="font-medium">
              Limit:
            </span>{" "}
            {room.participantLimit}
          </p>

          <p>
            <span className="font-medium">
              Visibility:
            </span>{" "}
            {room.visibility}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          {room.roomStatus ===
                        "live" && (
                        <>
                          <button
                            onClick={() =>
                              handleJoinRoom(
                                room.id
                              )
                            }
                            className={
                              buttonClass
                            }
                          >
                            Join
                          </button>

                          <button
                            onClick={() =>
                              handleEndRoom(
                                room.id
                              )
                            }
                            className="rounded-[5px] border border-red-200 bg-red-600 px-2 py-1 text-[8px] font-medium text-white hover:bg-red-700"
                          >
                            End
                          </button>
                        </>
                      )}

          <button
            className="rounded-[5px] border border-slate-200 bg-white px-2 py-1 text-[8px] text-slate-700"
          >
            View
          </button>
        </div>
      </div>
    );
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col gap-6">
        {/* Error */}
        {error && (
          <div className="rounded-[5px] border border-red-300 bg-red-50 p-2 text-[9px] text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-[5px] border border-slate-200 bg-white/50 p-3 text-[9px] text-slate-600">
            Loading rooms...
          </div>
        )}

        {/* Live Rooms */}
        <section className={sectionClass}>
          <h2 className="text-[11px] font-semibold text-slate-800">
            Current Live Rooms
          </h2>

          <p className="mb-4 mt-1 text-[9px] text-slate-500">
            Currently active live rooms.
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {liveRooms.length >
            0 ? (
              liveRooms.map(
                renderRoomCard
              )
            ) : (
              <p className="text-[9px] text-slate-500">
                No live rooms.
              </p>
            )}
          </div>
        </section>

        {/* Past Rooms */}
        <section className={sectionClass}>
          <h2 className="text-[11px] font-semibold text-slate-800">
            Past Rooms
          </h2>

          <p className="mb-4 mt-1 text-[9px] text-slate-500">
            Previously ended rooms.
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pastRooms.length >
            0 ? (
              pastRooms.map(
                renderRoomCard
              )
            ) : (
              <p className="text-[9px] text-slate-500">
                No past rooms.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomsHistory;
