"use client";

import React from "react";
import ParticipantCard from "./ParticipantCard";

interface Participant {
  id: number;
  name: string;
  role: string;
}

interface ParticipantSectionProps {
  title: string;
  participants: Participant[];
}

const ParticipantSection = ({
  title,
  participants,
}: ParticipantSectionProps) => {
  const uniqueParticipants =
    Array.from(
      new Map(
        participants.map(
          (
            participant
          ) => [
            participant.id,
            participant,
          ]
        )
      ).values()
    );

  return (
    <section
      className="
        rounded-[8px]
        border
        border-slate-200/70
        bg-white/40
        backdrop-blur-sm
        p-5
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[10px] font-semibold text-slate-800">
            {title}
          </h2>

          <p className="text-[8px] text-slate-500 mt-1">
            {uniqueParticipants.length} participants
          </p>
        </div>
      </div>

      {/* Empty State */}
      {uniqueParticipants.length === 0 ? (
        <div
          className="
            flex
            items-center
            justify-center
            rounded-3xl
            border
            border-dashed
            border-slate-200
            bg-slate-50/50
            py-10
          "
        >
          <p className="text-sm text-slate-400">
            No participants available
          </p>
        </div>
      ) : (
        /* Grid */
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
          "
        >
          {uniqueParticipants.map(
            (participant) => (
              <ParticipantCard
                key={participant.id}
                participant={
                  participant
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
};

export default ParticipantSection;
