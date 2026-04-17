'use client'

import { Bell, ChevronDown, Calendar } from 'lucide-react'

interface ProfileNotificationsProps {
  userName?: string
  userAvatar?: string
  dateRange?: {
    start: string
    end: string
  }
  notificationCount?: number
  onNotificationClick?: () => void
  onProfileClick?: () => void
}

export default function ProfileNotifications({
  userName = 'Evan Yates',
  userAvatar = 'EY',
  dateRange = {
    start: 'Nov 16, 2020',
    end: 'Dec 16, 2020',
  },
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
}: ProfileNotificationsProps) {
  return (
    <div className=" rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onNotificationClick}
          className="p-1 hover:bg-gray-100 rounded-lg transition relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        <button
          onClick={onProfileClick}
          className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-[10px] font-semibold">
            {userAvatar}
          </div>
          <span className="text-xs font-semibold text-gray-900">{userName}</span>
          <ChevronDown className="w-3 h-3 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-sm p-2">
        <Calendar className="w-3 h-3 text-gray-500" />
        <span className="truncate">
          {dateRange.start} - {dateRange.end}
        </span>
      </div>
    </div>
  )
}