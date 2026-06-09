"use client";

import React from "react";

const Navbar = () => {
  return (
    <header
      className="
        h-10
        w-full
        border-b
        border-slate-200/80
        bg-white
        px-4
        sm:px-6
        flex
        items-center
        justify-between
        select-none
        z-30
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-[10px] md:text-base font-bold tracking-tight text-slate-800 truncate">
          Obrive Community Rooms Management
        </h1>
      </div>
    </header>
  );
};

export default Navbar;