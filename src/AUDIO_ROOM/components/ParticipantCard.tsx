"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Crown,
  Shield,
} from "lucide-react";

interface Participant {
  id: number;
  name: string;
  role: string;
}

interface ParticipantCardProps {
  participant: Participant;
}

const ParticipantCard = ({
  participant,
}: ParticipantCardProps) => {
  const isMuted =
    participant.role === "LISTENER";

  const getRoleBadge = () => {
    switch (participant.role) {
      case "HOSTr":
        return (
          <div
            className="
              flex
              items-center
              gap-0.5
              lg:gap-1
              rounded-full
              bg-amber-50
              border
              border-amber-200
              px-1
              lg:px-2
              lg:text-[8px]
              py-0.5
            "
          >
            <Crown
              size={9}
              className="lg:size-2.5 text-amber-600"
            />

            <span className="text-[8px] lg:text-[10px] font-medium text-amber-700">
              Host
            </span>
          </div>
        );

      case "MODERATORr":
        return (
          <div
            className="
              flex
              items-center
              gap-0.5
              lg:gap-1
              rounded-full
              bg-sky-50
              border
              border-sky-200
              px-1
              lg:px-2
              py-0.5
            "
          >
            <Shield
              size={9}
              className="lg:size-2.5 text-sky-600"
            />

            <span className="text-[8px] lg:text-[10px] font-medium text-sky-700">
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
      className="
        rounded-[8px]
        border
        border-slate-200/70
        bg-white/50
        backdrop-blur-sm
        p-2
        lg:p-2
        shadow-sm
        transition-all
        hover:shadow-md
        lg:h-25 lg:w-25
      "
    >
      <div className="flex flex-col items-center text-center ">
        {/* Avatar */}
        <div
          className="
            relative
            flex
            h-12
            w-12
            lg:h-12
            lg:w-12
            items-center
            justify-center
            rounded-full
            bg-slate-200
            text-xs
            lg:text-[9px]
            font-semibold
            text-slate-700
          "
        >
          {participant.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}

          {/* Mic Status */}
          <div
            className={`
              absolute
              -bottom-1
              -right-1
              flex
              h-5
              w-5
              lg:h-6
              lg:w-6
              items-center
              justify-center
              rounded-full
              border-2
              border-white

              ${
                isMuted
                  ? "bg-red-100"
                  : "bg-green-100"
              }
            `}
          >
            {isMuted ? (
              <MicOff
                size={9}
                className="lg:size-3 text-red-600"
              />
            ) : (
              <Mic
                size={9}
                className="lg:size-3 text-green-600"
              />
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="mt-2 lg:mt-1.5 text-xs lg:text-[8px] font-semibold text-slate-800">
          {participant.name}
        </h3>

        {/* Role */}
        <p className="mt-0.5 lg:mt-0.5 text-[8px] lg:text-[8px] text-slate-500">
          {participant.role}
        </p>

        {/* Badge */}
        <div className="mt-2 lg:mt-2">
          {getRoleBadge()}
        </div>
      </div>
    </div>
  );
};

export default ParticipantCard;