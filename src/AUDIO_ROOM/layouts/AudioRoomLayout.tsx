"use client";

import React, { useMemo } from "react";
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
  // FIXED: Cached configuration settings values to block garbage compilation ticks
  const sections = useMemo(() => [
    { id: "participants", label: "Participants", icon: "👥" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "controls", label: "Controls", icon: "🎛️" },
  ], []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8f9fa] text-slate-900 antialiased">
      {/* High-Performance Solid Navbar */}
      <Navbar />

      {/* Main Framework Layout Viewport */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative flex-col md:flex-row">
        
        {/* 1. DESKTOP ONLY: Streamlined Left Side Tabs Bar Container */}
        <nav className="hidden md:flex w-44 bg-white border-r border-slate-200/80 flex-col gap-1 p-2 select-none">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mt-2 mb-1.5">
            Dashboard
          </p>
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full px-2.5 py-2 rounded-md font-medium text-xs transition-colors duration-100 flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-sm shrink-0">{section.icon}</span>
                <span className="truncate tracking-tight">{section.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 2. MOBILE ONLY: Fluid Snap Bottom Navigation Action Layer Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200/80 px-2 flex items-center justify-around z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.02)] select-none">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:scale-95 transition-all bg-transparent border-none outline-none cursor-pointer ${
                  isActive ? "text-slate-900 font-semibold" : "text-slate-400"
                }`}
              >
                <span className="text-base leading-none">{section.icon}</span>
                <span className="text-[10px] font-medium tracking-tight">
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 3. Main Central Render View Deck Content Layer */}
        {/* FIXED: Changed to borderless clean layout aesthetic; handles spacing blockages for mobile navigation overlay */}
        <main className="flex-1 min-w-0 overflow-hidden p-3 md:p-5 pb-16 md:pb-5">
          <div className="w-full h-full overflow-y-auto bg-transparent custom-scrollbar">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default AudioRoomLayout;