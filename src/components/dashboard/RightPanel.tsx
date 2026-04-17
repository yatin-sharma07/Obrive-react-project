'use client'

import { useState } from 'react'
import { ChevronRight, ChevronUp, ChevronDown, User } from 'lucide-react'

interface Event {
  id: string
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

interface Activity {
  id: string
  user: string
  avatar: string
  action: string
  timestamp: string
}

interface RightPanelProps {
  events?: Event[]
  activities?: Activity[]
}

export default function RightPanel({
  events = [
    {
      id: '1',
      title: 'Presentation of the new department',
      time: 'Today 15:00 PM',
      priority: 'high',
    },
    {
      id: '2',
      title: "Anne's Birthday",
      time: 'Today 15:00 PM',
      priority: 'medium',
    },
    {
      id: '3',
      title: "Ray's Birthday",
      time: 'Tomorrow 1:00 PM',
      priority: 'low',
    },
  ],
  activities = [
    {
      id: '1',
      user: 'Oscar Holloway',
      avatar: 'OH',
      action: 'Updated the status of Mind Map task to In Progress',
      timestamp: '',
    },
    {
      id: '2',
      user: 'Unknown',
      avatar: 'UN',
      action: 'Updated the status of Mind Map task to In Progress',
      timestamp: '',
    },
    {
      id: '3',
      user: 'Emily Tyler',
      avatar: 'ET',
      action: 'Attached files to the task',
      timestamp: '',
    },
  ],
}: RightPanelProps) {
  const [dateRange, setDateRange] = useState({
    start: 'Nov 16, 2020',
    end: 'Dec 16, 2020',
  })

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return <ChevronUp className="w-4 h-4 text-green-500" />
    if (priority === 'low') return <ChevronDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4" />
  }

  return (
    <div className="w-80 bg-white rounded-lg border border-gray-200 flex flex-col m-2 shadow-sm overflow-hidden">
      {/* Date Range Selector */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Date Range</span>
          <button className="text-gray-400 hover:text-gray-600 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-600">
          <p>{dateRange.start} - {dateRange.end}</p>
        </div>
      </div>

      {/* Nearest Events */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Nearest Events</h3>
            <button className="text-xs text-gray-500 hover:text-gray-700 transition">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {getPriorityIcon(event.priority)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Stream */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Activity Stream</h3>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {activity.avatar}
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {activity.action}
                  </p>
                  {activity.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
