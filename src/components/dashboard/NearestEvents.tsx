'use client'

import { ChevronUp, ChevronDown, Clock } from 'lucide-react'

interface EventItem {
  id: string
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
  duration?: string
  borderColor: string
}

interface NearestEventsProps {
  events?: EventItem[]
  onViewAll?: () => void
}

export default function NearestEvents({
  events = [
    {
      id: '1',
      title: 'Presentation of the new department',
      time: 'Today 15:00 PM',
      priority: 'high',
      duration: '4h',
      borderColor: 'bg-blue-500',
    },
    {
      id: '2',
      title: "Anne's Birthday",
      time: 'Today 16:00 PM',
      priority: 'low',
      duration: '4h',
      borderColor: 'bg-purple-500',
    },
    {
      id: '3',
      title: "Ray's Birthday",
      time: 'Tomorrow 12:00 PM',
      priority: 'low',
      duration: '4h',
      borderColor: 'bg-purple-500',
    },
  ],
  onViewAll,
}: NearestEventsProps) {
  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <ChevronUp className="w-4 h-4 text-green-500" />
    }
    return <ChevronDown className="w-4 h-4 text-green-500" />
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">Nearest Events</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition flex items-center gap-1"
        >
          View all
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-2 p-2 bg-gray-50  border-l-3 hover:bg-gray-100 transition cursor-pointer"
            style={{ borderLeftColor: event.borderColor === 'bg-blue-500' ? '#3b82f6' : '#a855f7' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 line-clamp-2">
                {event.title}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{event.time}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="flex-shrink-0">
                {getPriorityIcon(event.priority)}
              </div>

              {event.duration && (
                <div className="flex items-center gap-0.5 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-[9px] font-medium">{event.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}