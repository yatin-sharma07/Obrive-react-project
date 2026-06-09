"use client";

import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Radio,
  CalendarClock,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<any>>;
}

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  activeSection,
  setActiveSection,
}: SidebarProps) => {
  // FIXED: Memoizing static menu array configuration data to block useless lifecycle allocations during section switches
  const sidebarItems = useMemo(() => [
    {
      id: "create-room",
      label: "Create Room",
      icon: PlusCircle,
    },
    {
      id: "rooms-history",
      label: "Rooms & History",
      icon: Radio,
    },
    {
      id: "rooms-scheduled",
      label: "Scheduled Rooms",
      icon: CalendarClock,
    },
  ], []);

  return (
    <>
      {/* 1. MOBILE ONLY VIEWPORT MODE: Fixed Dock Bottom Navigation Layer Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200/80 px-2 flex items-center justify-around z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] select-none">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:scale-95 transition-all outline-none border-none bg-transparent cursor-pointer ${
                isActive ? "text-slate-900 font-semibold" : "text-slate-400"
              }`}
            >
              <Icon 
                size={18} 
                className={`transition-colors ${isActive ? "text-slate-900" : "text-slate-400"}`} 
              />
              <span className="text-[9px] font-medium tracking-tight">
                {item.label.split(" ")[0]} {/* Truncating text length to keep layout safe on small screen displays */}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 2. DESKTOP ONLY VIEWPORT MODE: Standard Collapsible Workspace Layout Sidebar Container */}
      <aside
        className={`
          hidden md:flex
          relative
          h-full
          border-r
          border-slate-200/60
          bg-white/70
          select-none
          flex-col
          will-change-[width]
          ${isCollapsed ? "w-[56px]" : "w-[200px]"}
        `}
      >
        {/* Header Block Section */}
        <div className={`flex items-center border-b border-slate-100 px-3 py-2.5 min-h-[49px] ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <h2 className="text-slate-800 font-semibold text-xs tracking-tight px-1">
              Workspace
            </h2>
          )}

          {/* Collapse Utility Button Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100/80 hover:text-slate-700 cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* Sidebar Menu Item Link Options Deck Scroll Body */}
        <div className="flex flex-col gap-0.5 p-2 overflow-y-auto flex-1 custom-scrollbar">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mt-2 mb-1.5">
              Manage Rooms
            </p>
          )}

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  group
                  flex
                  items-center
                  w-full
                  rounded-md
                  px-2.5
                  py-3
                  transition-colors
                  duration-100
                  outline-none
                  gap-2.5
                  cursor-pointer
                  ${isActive ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                {/* Icon Rendering Context */}
                <div className="flex items-center justify-center shrink-0">
                  <Icon
                    size={15}
                    className={`transition-colors duration-100 ${isActive ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}
                  />
                </div>

                {/* String Label Text Element */}
                {!isCollapsed && (
                  <span className="text-xs tracking-tight truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;