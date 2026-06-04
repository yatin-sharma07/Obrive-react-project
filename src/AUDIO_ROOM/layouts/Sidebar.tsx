"use client";

import React from "react";
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

const sidebarItems = [
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
];

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  activeSection,
  setActiveSection,
}: SidebarProps) => {
  return (
    <aside
      className={`
        relative
        h-full
        transition-all
        duration-300
        ease-in-out
        border-r
        border-slate-200/60
        bg-white/40
        backdrop-blur-md
        select-none
        flex
        flex-col
        ${isCollapsed ? "w-[56px]" : "w-[200px]"}
      `}
    >
      {/* Header */}
      <div className={`flex items-center border-b border-slate-100 px-3 py-2.5 min-h-[49px] ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <h2 className="text-slate-800 font-semibold text-xs tracking-tight px-1">
            Workspace
          </h2>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            flex
            items-center
            justify-center
            rounded-md
            p-1.5
            text-slate-400
            transition-colors
            hover:bg-slate-100/80
            hover:text-slate-700
          "
        >
          {isCollapsed ? (
            <ChevronRight size={15} />
          ) : (
            <ChevronLeft size={15} />
          )}
        </button>
      </div>

      {/* Sidebar Menu Body */}
      <div className="flex flex-col gap-0.5 p-2 overflow-y-auto flex-1">
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
                transition-all
                duration-150
                outline-none
                gap-2.5
                cursor-pointer
                ${
                  isActive
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              {/* Icon Matrix Wrapper */}
              <div className="flex items-center justify-center shrink-0">
                <Icon
                  size={15}
                  className={`
                    transition-colors duration-150
                    ${
                      isActive 
                        ? "text-slate-800" 
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  `}
                />
              </div>

              {/* Label Component */}
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
  );
};

export default Sidebar;