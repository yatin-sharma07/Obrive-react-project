"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Crown,
  Shield,
  Volume2,
  VolumeX,
  LogOut,
  Trash2,
} from "lucide-react";
import {
  useSocket,
} from "@/context/SocketContext";

interface Participant {
  id: number;
  name: string;
  role: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
}

interface ParticipantCardProps {
  participant: Participant;
  roomId: number;
  currentUserId?: number;
  canModerate?: boolean;
}

const ParticipantCard = ({
  participant,
  roomId,
  currentUserId,
  canModerate = false,
}: ParticipantCardProps) => {
  const {
    socket,
  } = useSocket();

  const normalizedRole =
    participant.role?.toLowerCase() ||
    "";

  const isMuted =
    participant.isMuted ?? true;

  const isSpeaking =
    Boolean(
      participant.isSpeaking &&
      !isMuted
    );

  const canBeMuted =
    canModerate &&
    participant.id !== currentUserId &&
    !isMuted &&
    [
      "host",
      "moderator",
      "speaker",
    ].includes(
      normalizedRole
    );

  const handleModeratorMute =
    () => {
      if (
        !socket ||
        !canBeMuted
      ) {
        return;
      }

      socket.emit(
        "mute_speaker",
        {
          roomId,
          userId:
            participant.id,
        }
      );
    };

  const handleModeratorUnmute =
    () => {
      if (
        !socket ||
        !canModerate ||
        participant.id ===
          currentUserId ||
        isMuted
      ) {
        return;
      }

      socket.emit(
        "unmute_speaker",
        {
          roomId,
          userId:
            participant.id,
        }
      );
    };

  const handleDowngradeToListener =
    () => {
      if (
        !socket ||
        !canModerate ||
        participant.id ===
          currentUserId ||
        [
          "listener",
        ].includes(
          normalizedRole
        )
      ) {
        return;
      }

      socket.emit(
        "downgrade_to_listener",
        {
          roomId,
          userId:
            participant.id,
        }
      );
    };

  const handleRemoveParticipant =
    () => {
      if (
        !socket ||
        !canModerate ||
        participant.id ===
          currentUserId
      ) {
        return;
      }

      if (
        confirm(
          `Remove ${participant.name} from room?`
        )
      ) {
        socket.emit(
          "remove_participant",
          {
            roomId,
            userId:
              participant.id,
          }
        );
      }
    };

  const getRoleBadge = () => {
    switch (normalizedRole) {
      case "host":
        return (
          <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5">
            <Crown
              size={9}
              className="text-amber-600"
            />
            <span className="text-[8px] font-medium text-amber-700">
              Host
            </span>
          </div>
        );

      case "moderator":
        return (
          <div className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5">
            <Shield
              size={9}
              className="text-sky-600"
            />
            <span className="text-[8px] font-medium text-sky-700">
              Moderator
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`
        rounded-[8px]
        border
        p-2
        shadow-sm
        transition-all
        hover:shadow-md
        lg:h-25
        lg:w-25
        ${isSpeaking
          ? "border-green-300 bg-green-50/70 ring-0.5 ring-green-200 animate-pulse"
          : "border-slate-200/70 bg-white/50"}
      `}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-slate-200
            text-xs
            font-semibold
            text-slate-700
            ${isSpeaking ? "ring-2 ring-green-400" : ""}
          `}
        >
          {participant.name
            .split(" ")
            .map((namePart) => namePart[0])
            .join("")
            .slice(0, 2)}

          <div
            className={`
              absolute
              -bottom-1
              -right-1
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              border-2
              border-white
              ${isMuted ? "bg-red-100" : "bg-green-100"}
            `}
          >
            {isMuted ? (
              <MicOff
                size={9}
                className="text-red-600"
              />
            ) : (
              <Mic
                size={9}
                className="text-green-600"
              />
            )}
          </div>
        </div>

        <h3 className="mt-2 text-xs font-semibold text-slate-800 lg:text-[8px]">
          {participant.name}
        </h3>

        <p className="mt-0.5 text-[8px] text-slate-500">
          {participant.role}
        </p>

        {isSpeaking && (
          <p className="mt-0.5 text-[8px] font-medium text-green-600">
            {/* speaking */}
          </p>
        )}

        <div className="mt-2 flex items-center justify-center gap-1 flex-wrap">
          {getRoleBadge()}

          {/* MUTE BUTTON - Show when speaker is not muted */}
          {canBeMuted && (
            <button
              onClick={handleModeratorMute}
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                border
                border-red-200
                bg-red-50
                text-red-600
                transition
                hover:bg-red-100
              "
              title="Mute speaker"
            >
              <MicOff
                size={10}
              />
            </button>
          )}

          {/* UNMUTE BUTTON - Show when speaker is muted and moderator */}
          {canModerate &&
            participant.id !==
              currentUserId &&
            isMuted &&
            ![
              "listener",
            ].includes(
              normalizedRole
            ) && (
            <button
              onClick={
                handleModeratorUnmute
              }
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                border
                border-green-200
                bg-green-50
                text-green-600
                transition
                hover:bg-green-100
              "
              title="Unmute speaker"
            >
              <Volume2
                size={10}
              />
            </button>
          )}

          {/* DOWNGRADE BUTTON - Show for speakers/moderators when moderator */}
          {canModerate &&
            participant.id !==
              currentUserId &&
            ![
              "listener",
              "host",
              "admin",
            ].includes(
              normalizedRole
            ) && (
            <button
              onClick={
                handleDowngradeToListener
              }
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                border
                border-amber-200
                bg-amber-50
                text-amber-600
                transition
                hover:bg-amber-100
              "
              title="Downgrade to listener"
            >
              <LogOut
                size={10}
              />
            </button>
          )}

          {/* REMOVE BUTTON - Show when moderator */}
          {canModerate &&
            participant.id !==
              currentUserId && (
            <button
              onClick={
                handleRemoveParticipant
              }
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                border
                border-red-300
                bg-red-100
                text-red-700
                transition
                hover:bg-red-200
              "
              title="Remove from room"
            >
              <Trash2
                size={10}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;
