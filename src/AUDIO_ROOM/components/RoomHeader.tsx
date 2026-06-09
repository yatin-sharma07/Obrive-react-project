"use client";

import React from "react";
import { Users, Radio } from "lucide-react";

interface RoomHeaderProps {
  title?: string;
  description?: string;
  participantCount?: number;
}

const RoomHeader = ({ title, description, participantCount = 0 }: RoomHeaderProps) => {
  return (
    <div className="w-full bg-white px-4 py-2 shadow-xs border-b border-black/[0.03]">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left Side Content - Compact & Inline */}
        <div className="min-w-0 flex flex-items-center gap-3 items-center">
          
          {/* Micro Status Badge */}
          <div className="flex items-center gap-1 rounded-full border border-[#076d47]/20 bg-[#076d47]/5 px-2 py-0.5 shrink-0">
            <Radio size={10} className="text-[#076d47]" />
            <span className="text-[9px] font-bold text-[#076d47] uppercase tracking-wider">Live</span>
          </div>

          {/* Heading and Meta Description Stack */}
          <div className="min-w-0">
            <h1 className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md md:max-w-lg leading-none">
              {title || "Live Room"}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-xs sm:max-w-md md:max-w-xl mt-0.5 leading-none">
              {description || "Room details will appear here."}
            </p>
          </div>

        </div>

        {/* Right Side Metric Block - Ultra Low Profile */}
        <div className="flex items-center gap-2 shrink-0 border border-slate-100 rounded-md bg-slate-50/50 px-2 py-1">
          <Users size={12} className="text-slate-500" />
          <span className="text-[10px] font-bold text-slate-700 leading-none">
            {participantCount}
          </span>
          <span className="hidden sm:inline text-[9px] font-medium text-slate-400 border-l border-slate-200 pl-1.5 leading-none">
            Active
          </span>
        </div>

      </div>
    </div>
  );
};

export default RoomHeader;