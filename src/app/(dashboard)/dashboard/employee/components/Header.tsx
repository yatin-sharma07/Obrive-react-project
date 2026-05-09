'use client'

import { useState } from 'react'
import { Search, Bell, RotateCcw } from 'lucide-react'
import ProfileNotifications from './ProfileNotifications'

interface HeaderProps {
  userName?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function Header({ userName = 'Evan', onRefresh, isRefreshing = false, activeSection }: HeaderProps & { activeSection: string }) {


  return (
    <div className='flex-row flex justify-between p-2'>
      <div className='w-1/2'>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 max-w-xs">

                    <div className="relative">
            <Search className="w-2.5 absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              className="w-85 w-min-60 pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition"
            />
          </div>
         
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="self-start rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            title="Refresh dashboard"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}

      </div>

      <div>
        <p className="text-[14px] text-gray-500 mb-1 mt-5 font-semibold">Welcome back, {userName}!</p>
        <h1 className="text-[37px] font-extrabold text-[#074139] sm:text-xl">{activeSection}</h1>
      </div>

      </div>

      <ProfileNotifications />
    </div>
  )
}
