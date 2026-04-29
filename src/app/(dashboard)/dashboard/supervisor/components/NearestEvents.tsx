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
  setActiveSection: (key: string) => void
}

export default function NearestEvents({
  events = [],
  setActiveSection,
}: NearestEventsProps) {
  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <ChevronUp className="w-4 h-4 text-green-500" />
    }
    return <ChevronDown className="w-4 h-4 text-green-500" />
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-sm font-bold text-gray-900">Nearest Events</h3>

        <button
          onClick={() => setActiveSection('events')}
          className="flex items-center gap-1 text-xs font-semibold text-teal-600 transition hover:text-teal-700"
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
            className="cursor-pointer overflow-hidden rounded-lg border border-[#e8f0fb] bg-white shadow-sm transition hover:bg-gray-50"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: event.borderColor === "bg-blue-500" ? "#3b82f6" : "#a855f7",
            }}
          >
            <div className="flex items-start gap-3 p-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eef7ff] text-[#1a472a]">
                <Clock className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 line-clamp-2">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-500">{event.time}</p>
                  </div>

                  <div className="mt-0.5 flex-shrink-0">
                    {getPriorityIcon(event.priority)}
                  </div>
                </div>

                {event.duration ? (
                  <div className="mt-2 flex items-center gap-1 text-[9px] font-medium text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{event.duration}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
