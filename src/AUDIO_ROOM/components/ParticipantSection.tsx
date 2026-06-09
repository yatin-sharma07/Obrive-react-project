"use client";

import React from "react";
import ParticipantCard from "./ParticipantCard";

interface Participant {
  id: number;
  name: string; 
  role: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
}

interface ParticipantSectionProps {
  title: string;
  participants: Participant[];
  roomId: number;
  currentUserId?: number;
  canModerate?: boolean;
}

const ParticipantSection = ({
  title,
  participants,
  roomId,
  currentUserId,
  canModerate = false,
}: ParticipantSectionProps) => {
  const uniqueParticipants = Array.from(
    new Map(participants.map((p) => [p.id, p])).values()
  );

  return (
    <section className="w-full">
      {/* Sub-Header: Ultra-clean and compact text alignment */}
      <div className="flex items-baseline gap-2 mb-3 px-1">
        <h2 className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">
          {title}
        </h2>
        <span className="text-[10px] font-medium text-slate-400">
          • {uniqueParticipants.length}
        </span>
      </div>

      {/* Empty View State */}
      {uniqueParticipants.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-200/60 bg-slate-50/30 py-6">
          <p className="text-[9px] text-slate-400 font-medium">
            No participants available
          </p>
        </div>
      ) : (
        /* FIXED: Changed from an expansive grid to a dense, fluid flex-wrap pattern.
          This pulls items tight against one another, preserving vertical layout real estate.
        */
        <div className="flex flex-wrap gap-x-3 gap-y-4 px-1">
          {uniqueParticipants.map((participant) => (
            <div key={participant.id} className="shrink-0 w-[72px] sm:w-[80px]">
              <ParticipantCard
                participant={participant}
                roomId={roomId}
                currentUserId={currentUserId}
                canModerate={canModerate}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ParticipantSection;