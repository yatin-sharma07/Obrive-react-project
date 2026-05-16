"use client";

import React from "react";
import {
  Users,
  Radio,
  ChevronDown,
} from "lucide-react";

const RoomHeader = () => {
  return (
    <header
      className="
        border-b
        border-slate-200/60
        bg-white/40
        backdrop-blur-md
        px-3
        py-1
        shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left Side */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Room Status */}
            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-green-200
                bg-green-50
                px-2
                py-0.5
              "
            >
              <Radio
                size={8}
                className="text-green-500"
              />

              <span className="text-[8px] font-medium text-green-700">
                Live Room
              </span>
            </div>

            {/* Room Title */}
            <h1 className="text-[10px] font-semibold text-slate-800 truncate">
              Product Planning Meeting
            </h1>

            {/* Dropdown */}
            {/* <button className="text-slate-500 hover:text-slate-700 transition">
              <ChevronDown size={18} />
            </button> */}
          </div>

          <p className="text-[8px] text-slate-500 mt-1">
            Discussing product roadmap and
            upcoming feature planning.
          </p>
        </div>

        {/* Right Side */}
        <div
          className="
            flex
            items-center
            gap-3
            rounded-[5px]
            border
            border-slate-200/70
            bg-white/50
            px-2
            py-1
          "
        >
          <Users
            size={18}
            className="text-slate-600"
          />

          <div>
            <p className="text-[10px] font-medium text-slate-800">
              23 Participants
            </p>

            <p className="text-[8px] text-slate-500">
              Active in room
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoomHeader;