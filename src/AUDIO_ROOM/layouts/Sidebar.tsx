"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LayoutTemplate,
  Radio,
  CalendarClock,
  FolderOpen,
  Settings,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  activeSection: string;

  setActiveSection: React.Dispatch<
    React.SetStateAction<any>
  >;
}

const sidebarItems = [
  {
    id: "create-room",
    label: "Create Room",
    icon: PlusCircle,
  },
  {
    id: "templates",
    label: "Templates",
    icon: LayoutTemplate,
  },
  {
    id: "active-rooms",
    label: "Active Rooms",
    icon: Radio,
  },
  {
    id: "schedule-room",
    label: "Schedule Room",
    icon: CalendarClock,
  },
  {
    id: "recordings",
    label: "Room Recordings",
    icon: FolderOpen,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
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
        bg-white/30
        backdrop-blur-md
        shadow-sm
        ${
          isCollapsed
            ? "w-[60px]"
            : "w-[190px]"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-slate-200/50">
        {!isCollapsed && (
          <div>
            <h2 className="text-slate-800 font-semibold text-[12px] px-2">
              Configurations
            </h2>

            {/* <p className="text-xs text-slate-500 mt-1">
              Manage room configurations
            </p> */}
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() =>
            setIsCollapsed(!isCollapsed)
          }
          className="
            flex
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white/50
            p-2
            text-slate-600
            transition-all
            hover:bg-slate-100/70
          "
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col gap-1 p-3 overflow-y-auto">
        <p
          className={`
            text-[9px]
            font-medium
            uppercase
            tracking-wide
            text-slate-400
            px-3
            mt-2
            ${
              isCollapsed
                ? "hidden"
                : "block"
            }
          `}
        >
          Manage Rooms
        </p>

        {sidebarItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
                className={`
                group
                flex
                items-center
                gap-1
                rounded-[2px]
                px-2
                py-2
                transition-all
                duration-50
                cursor-pointer

                ${
                activeSection === item.id
                    ? "bg-white shadow-sm text-slate-900 border border-black-500"
                    : "text-slate-700 hover:bg-white/60"
                }
                `}
              onClick={() => setActiveSection(item.id)}
            >
              {/* Icon */}
              <div className="flex items-center justify-center min-w-[24px]">
                <Icon
                  size={14}
                  className="
                    text-slate-600
                    group-hover:text-slate-900
                  "
                />
              </div>

              {/* Label */}
              {!isCollapsed && (
                <span className="text-[10px] font-medium">
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