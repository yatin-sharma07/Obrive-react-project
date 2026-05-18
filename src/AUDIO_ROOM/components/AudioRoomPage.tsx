"use client";

import React, { useState } from "react";
import RoomHeader from "./RoomHeader";
import ParticipantSection from "./ParticipantSection";
import ChatPanel from "./ChatPanel";
import BottomControls from "./BottomControls";

const mockParticipants = {
  hostAndSpeakers: [
    {
      id: 1,
      name: "Rohan Sharma",
      role: "HOST",
    },
    {
      id: 2,
      name: "Amit Kumar",
      role: "SPEAKER",
    },
    {
      id: 3,
      name: "Neha Verma",
      role: "SPEAKER",
    },
  ],

  moderators: [
    {
      id: 4,
      name: "Priya Singh",
      role: "MODERATOR",
    },
    {
      id: 5,
      name: "Arjun Mehta",
      role: "MODERATOR",
    },
  ],

  listeners: [
    {
      id: 6,
      name: "Karan",
      role: "LISTENER",
    },
    {
      id: 7,
      name: "Riya",
      role: "LISTENER",
    },
    {
      id: 8,
      name: "Anjali",
      role: "LISTENER",
    },
    {
      id: 9,
      name: "Rahul",
      role: "LISTENER",
    },
  ],
};

const AudioRoomPage = () => {
  const [isChatOpen, setIsChatOpen] =
    useState(true);

  const currentUserRole =
    "LISTENER";

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="h-full flex flex-col min-h-0">
        {/* Header */}
        <RoomHeader />

        {/* Content Area - Participants and Chat */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left - Participants */}
          <div className="flex-1 min-w-0 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-5">
              {/* Host + Speakers */}
              <ParticipantSection
                title="Host & Speakers"
                participants={
                  mockParticipants.hostAndSpeakers
                }
              />

              {/* Moderators */}
              <ParticipantSection
                title="Moderators"
                participants={
                  mockParticipants.moderators
                }
              />

              {/* Listeners */}
              <ParticipantSection
                title="Listeners"
                participants={
                  mockParticipants.listeners
                }
              />
            </div>
          </div>

          {/* Right Chat Panel */}
          {isChatOpen && (
            <div className="w-[360px] shrink-0 border-l border-slate-200/60 bg-white/40 backdrop-blur-md overflow-y-auto">
              <ChatPanel
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
              />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <BottomControls 
          role={currentUserRole}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />
      </div>
    </div>
  );
};

export default AudioRoomPage;