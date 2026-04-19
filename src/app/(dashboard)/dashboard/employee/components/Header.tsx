'use client'

import { useState } from 'react'
import { Search, Bell, RotateCcw } from 'lucide-react'

interface HeaderProps {
  userName?: string
  pageTitle?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}

export default function Header({ userName = 'Evan', pageTitle = 'Dashboard', onRefresh, isRefreshing = false }: HeaderProps) {


  return (
    <div >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 max-w-xs">
         
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="ml-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh dashboard"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}

      </div>

      <div>
        <p className="text-[15px] text-gray-500 mb-1">Welcome back, {userName}!</p>
        <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
      </div>
    </div>
  )
}