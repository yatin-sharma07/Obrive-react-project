'use client'

import { useState } from 'react'
import { Search, Bell } from 'lucide-react'

interface HeaderProps {
  userName?: string
  pageTitle?: string
}

export default function Header({ userName = 'Evan', pageTitle = 'Dashboard' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition"
            />
          </div>
        </div>


      </div>

      <div>
        <p className="text-[10px] text-gray-500 mb-1">Welcome back, {userName}!</p>
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
      </div>
    </div>
  )
}