"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Hand,
  Smile,
  PhoneOff,
  Shield,
  MessageCircle,
  Square,
} from "lucide-react";

import {
  API_BASE_URL,
} from "@/lib/api";
import {
  useSocket,
} from "@/context/SocketContext";

interface BottomControlsProps {
  roomId: number;
  userId?: number;
  

  role:
    | "admin"
    | "host"
    | "moderator"
    | "speaker"
    | "listener";

  isChatOpen?: boolean;

  isMuted?: boolean;

  setIsChatOpen?: (
    value: boolean
  ) => void;
}



const BottomControls = ({
  roomId,
  role,
  userId,
  isChatOpen = false,
  isMuted = true,
  setIsChatOpen,
}: BottomControlsProps) => {
  const {
    socket,
  } = useSocket();

  const canSpeak =
    role !== "listener";

  console.log(
  "Current Role:",
  role
);

const handleMicToggle =
  () => {
    if (
      !socket ||
      !userId ||
      !canSpeak
    ) {
      return;
    }

    socket.emit(
      "audio_mic_toggle",
      {
        roomId:
          Number(roomId),
        userId,
        isMuted:
          !isMuted,
      }
    );
  };


const handleEndRoom =
  async () => {
    try {
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
                  userId,
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

      window.location.href =
        "/audio-room";
    } catch (
      error
    ) {
      console.error(
        "❌ End Room Error:",
        error
      );
    }
  };

const handleLeaveRoom =
  async () => {
    try {
      // const userId = 1;

      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/leave-room`,
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
                  userId,
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
            "Failed to leave room"
        );
      }

      console.log(
        "✅ Left Room:",
        data
      );

      window.location.href =
        "/audio-room";
    } catch (
      error
    ) {
      console.error(
        "❌ Leave Room Error:",
        error
      );
    }
  };



  const handleRaiseHand =
  async () => {
    try {
      const response =
        await fetch(
          `${API_BASE_URL}/audio-room/raise-hand`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                roomId:
                  Number(roomId),

                userId,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message
        );
      }

      console.log(
        "✋ Hand Raised:",
        data
      );
    } catch (
      error
    ) {
      console.error(
        "Raise Hand Error:",
        error
      );
    }
  };


  return (
    <div
      className="
        border-t
        border-slate-200/60
        bg-white/40
        backdrop-blur-md
        px-5
        py-2
      "
    >
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* <div className="text-xs text-red-600 font-bold">
              Role: {role}
        </div> */}
        {/* Mic Button */}
        {canSpeak && (
          <button
            onClick={handleMicToggle}
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              transition-all
              shadow-sm

              ${
                isMuted
                  ? "bg-red-100 border border-red-200"
                  : "bg-green-100 border border-green-200"
              }
            `}
          >
            {isMuted ? (
              <MicOff
                size={22}
                className="text-red-600"
              />
            ) : (
              <Mic
                size={22}
                className="text-green-600"
              />
            )}
          </button>
        )}

        {/* Reaction */}
        <button
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-slate-200
            bg-white/50
            shadow-sm
            transition
            hover:bg-white
          "
        >
          <Smile
            size={22}
            className="text-slate-700"
          />
        </button>

        {/* Raise Hand */}
        {role === "listener" && (
          <button
            onClick={handleRaiseHand}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-amber-200
              bg-amber-100
              shadow-sm
              transition
              hover:bg-amber-200
            "
          >
            <Hand
              size={22}
              className="text-amber-700"
            />
          </button>
        )}

        {/* Moderator Controls */}
        {(role ===
          "moderator" ||
          role === "host" ||
          role ===
            "admin") && (
          <button
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-sky-200
              bg-sky-100
              shadow-sm
              transition
              hover:bg-sky-200
            "
          >
            <Shield
              size={22}
              className="text-sky-700"
            />
          </button>
        )}

        {/* Chat Toggle */}
        <button
          onClick={() => setIsChatOpen && setIsChatOpen(!isChatOpen)}
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            shadow-sm
            transition
            hover:bg-blue-300

            ${
              isChatOpen
                ? "border border-blue-200 bg-blue-100"
                : "border border-slate-200 bg-blue-200 hover:bg-white"
            }
          `}
        >
          <MessageCircle
            size={22}
            className={
              isChatOpen
                ? "text-blue-600"
                : "text-slate-700"
            }
          />
        </button>

        {/* End Room */}
{role ===
  "host" && (
  <button
    onClick={
      handleEndRoom
    }
    className="
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-full
      border
      border-red-300
      bg-red-600
      shadow-sm
      transition
      hover:bg-red-700
    "
  >
    <Square
      size={22}
      className="text-white"
    />
  </button>
)}

        {/* Leave Room */}
        <button
        onClick={ handleLeaveRoom }
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-red-200
            bg-red-100
            shadow-sm
            transition
            hover:bg-red-200
          "
        >
          <PhoneOff
            size={22}
            className="text-red-700"
          />
        </button>
      </div>
    </div>
  );
};

export default BottomControls;
