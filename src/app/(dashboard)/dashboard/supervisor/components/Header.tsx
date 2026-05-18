"use client";

import { Plus, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import CreateUserDialog from "./CreateUserDialog";

interface HeaderProps {
  pageTitle: string;
  userName?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Header({
  pageTitle = "Supervisor Dashboard",
  userName = "Supervisor",
  onRefresh,
  isRefreshing = false,
}: HeaderProps) {
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  return (
    <>
      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row sm:items-center">
            <div className="w-full sm:max-w-xs">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateUserOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#074139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5248] focus:outline-none focus:ring-2 focus:ring-[#074139]/25"
            >
              <Plus className="h-4 w-4" />
              Create User
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="self-start rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
              title="Refresh dashboard"
            >
              <RotateCcw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1 text-[12px] text-gray-500">
            Welcome back, {userName}!
          </p>
          <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
            {pageTitle}
          </h1>
        </div>
      </div>

      <CreateUserDialog
        open={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
      />
    </>
  );
}
