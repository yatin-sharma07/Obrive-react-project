"use client";

import React, { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface RoomConfigurationLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: React.Dispatch<
    React.SetStateAction<any>
  >;
}

const RoomConfigurationLayout = ({
  children,
  activeSection,
  setActiveSection,
}: RoomConfigurationLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState<boolean>(false);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

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

export default RoomConfigurationLayout;