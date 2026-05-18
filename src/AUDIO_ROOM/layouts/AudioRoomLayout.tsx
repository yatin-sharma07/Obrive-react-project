"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";

interface AudioRoomLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<any>>;
}

const AudioRoomLayout = ({
  children,
  activeSection,
  setActiveSection,
}: AudioRoomLayoutProps) => {
  const sections = [
    { id: "participants", label: "Participants", icon: "👥" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "controls", label: "Controls", icon: "🎛️" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-32 bg-white/30 border-r border-slate-200/60 backdrop-blur-md flex flex-col gap-2 p-3 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                activeSection === section.id
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-700 hover:bg-white/50"
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-hidden p-4 md:p-2">
          <div className="w-full h-full overflow-y-auto rounded-[5px] border border-slate-200/60 bg-white/40 backdrop-blur-md shadow-sm p-5 md:p-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AudioRoomLayout;
