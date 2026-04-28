'use client'

import { Clock, ChevronUp, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDashboardData } from '../../useDashboardData'
import SkeletonLoading from '@/components/SkelitonLoading'

interface EventItem {
  id: string
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
  duration?: string
  borderColor: string
}

export default function NearestEventsSection() {
  const { events, loading } = useDashboardData('employee')

  if (loading) {
   <SkeletonLoading/>
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <ChevronUp className="w-4 h-4 text-orange-500" />
    }
    if (priority === 'low') {
      return <ChevronDown className="w-4 h-4 text-green-500" />
    }
    return null
  }

  return (
    <div className="p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#073933]">
          Nearest Events
        </h2>

        <button className="bg-[#073933] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow hover:bg-[#0a4a42] transition">
          <span className="text-lg">+</span>
          Add Event
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {events.map((event: EventItem, i: number) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
          >
            
            {/* Left */}
            <div className="flex items-start gap-3">
              
              {/* Colored line */}
              <div
                className="w-1 h-full rounded-full"
                style={{ borderLeftColor: event.borderColor === 'bg-blue-500' ? '#3b82f6' : '#a855f7' }}
              />

              {/* Text */}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {event.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {event.time}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              
              {getPriorityIcon(event.priority)}

              {event.duration && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">
                    {event.duration}
                  </span>
                </div>
              )}
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  )
}