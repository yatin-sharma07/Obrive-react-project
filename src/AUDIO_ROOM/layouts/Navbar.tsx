"use client";

import React from "react";
import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  return (
    <header
      className="
        h-[35px]
        min-h-[35px]
        w-full
        border-b
        border-slate-200/60
        bg-white/30
        backdrop-blur-md
        px-5
        md:px-6
        flex
        items-center
        justify-between
        shadow-sm
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <h1 className="text-sm md:text-sm font-semibold text-slate-800">
            Obrive Confrences
          </h1>
{/* 
          <p className="text-xs text-slate-500 hidden sm:block">
            Manage rooms, schedules and recordings
          </p> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        {/* <div
          className="
            hidden
            md:flex
            items-center
            gap-2
            rounded-2xl
            border
            border-slate-200/70
            bg-white/50
            px-4
            py-2.5
            min-w-[260px]
          "
        >
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search rooms..."
            className="
              w-full
              bg-transparent
              outline-none
              text-sm
              text-slate-700
              placeholder:text-slate-400
            "
          />
        </div> */}
{/* 
                                  Notifications
                                  <button
                                    className="
                                      relative
                                      flex
                                      items-center
                                      justify-center
                                      rounded-2xl
                                      border
                                      border-slate-200/70
                                      bg-white/50
                                      p-3
                                      transition-all
                                      hover:bg-white/80
                                    "
                                  >
                                    <Bell
                                      size={20}
                                      className="text-slate-600"
                                    />

                                    Notification Dot
                                    <span
                                      className="
                                        absolute
                                        top-2
                                        right-2
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-red-400
                                      "
                                    />
                                  </button>


        Profile
        <button
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200/70
            bg-white/50
            px-3
            py-2
            transition-all
            hover:bg-white/80
          "
        >
          Avatar 
          <div
            className="
              h-10
              w-10
              rounded-full
              bg-slate-200
              flex
              items-center
              justify-center
              text-sm
              font-semibold
              text-slate-700
            "
          >
            AK
          </div>

          User Info
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-800">
              Admin User
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={18}
            className="text-slate-500 hidden md:block"
          />
        </button> */}
      </div>
    </header>
  );
};

export default Navbar;