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
} from "lucide-react";

interface BottomControlsProps {
  role:
    | "ADMIN"
    | "HOST"
    | "MODERATOR"
    | "SPEAKER"
    | "LISTENER";
  isChatOpen?: boolean;
  setIsChatOpen?: (value: boolean) => void;
}

const BottomControls = ({
  role,
  isChatOpen = false,
  setIsChatOpen,
}: BottomControlsProps) => {
  const canSpeak =
    role !== "LISTENER";

  const isMuted = true;

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
        {/* Mic Button */}
        {canSpeak && (
          <button
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
        {role ===
          "LISTENER" && (
          <button
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
          "MODERATOR" ||
          role === "HOST" ||
          role ===
            "ADMIN") && (
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

        {/* Leave Room */}
        <button
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