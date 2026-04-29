'use client'

import { RotateCcw, Search } from 'lucide-react'

interface HeaderProps {
  pageTitle: string
  userName?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function Header({
  pageTitle = 'Supervisor Dashboard',
  userName = 'Supervisor',
  onRefresh,
  isRefreshing = false,
}: HeaderProps) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="self-start rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            title="Refresh dashboard"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div>
        <p className="text-[12px] text-gray-500 mb-1">Welcome back, {userName}!</p>
        <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{pageTitle}</h1>
      </div>
    </div>
  )
}
