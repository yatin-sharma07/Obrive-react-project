"use client";

import Board from "@/components/pages/Employee-dasboard/board/Board";
import React from "react";
import NearestEvents from "../components/NearestEvents";
import { useDashboardData } from "../../useDashboardData";
import SkeletonLoading from "@/components/SkelitonLoading";

const Notes = () => {
  const { events = [], loading } = useDashboardData("employee");

  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <div className="flex gap-4 h-full">
      
      {/* LEFT SIDE (Board Section) */}
      <div className="flex-1 flex flex-col">
        
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#073933]">
            Sticky Notes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            See what's going on in your work environment.
          </p>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-hidden bg-white rounded-xl p-4 shadow-sm">
          <Board />
        </div>
      </div>

      {/* RIGHT SIDE (Nearest Events Panel) */}
      <div className="w-80 flex flex-col">
        <div className="flex-1 bg-white rounded-xl p-3 shadow-sm overflow-y-auto">
          <NearestEvents events={events} setActiveSection={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Notes;