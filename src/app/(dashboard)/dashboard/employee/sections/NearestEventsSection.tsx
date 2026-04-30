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

export default function NearestEventsSection({setActiveSection}:{setActiveSection:(key:string)=>void}) {
  const { events = [], loading } = useDashboardData('employee')

  if (loading) {
    return <SkeletonLoading />
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

  const getBorderColor = (borderColor: string) =>
    borderColor === 'bg-blue-500' ? '#3b82f6' : '#a855f7'

  return (
    <div className="p-4 sm:p-6">
      
      {/* Header */}
      <div className='mb-6'>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[#073933] sm:text-2xl">
          Nearest Events
        </h2>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#073933] px-4 py-2 text-white shadow transition hover:bg-[#0a4a42] sm:w-auto">
          <span className="text-lg">+</span>
          Add Event
        </button>
      </div>
      <div>
        <h1>
          Stay Updated About The Nearest Events
        </h1>
      </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {(events ?? []).map((event: EventItem, i: number) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
            className="group relative overflow-hidden rounded-[26px] border bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            style={{
              borderColor: `${getBorderColor(event.borderColor)}25`,
              borderLeftWidth: '6px',
              borderLeftColor: getBorderColor(event.borderColor),
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-24 opacity-60 transition-opacity duration-300 group-hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${getBorderColor(event.borderColor)}18 0%, transparent 70%)`,
              }}
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                  style={{
                    backgroundColor: `${getBorderColor(event.borderColor)}16`,
                    color: getBorderColor(event.borderColor),
                  }}
                >
                  <Clock className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 sm:text-base">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2 rounded-full bg-[#f5f8fc] px-3 py-1.5 text-xs font-medium text-gray-600">
                  {getPriorityIcon(event.priority)}
                  <span className="capitalize">{event.priority}</span>
                </div>

                {event.duration && (
                  <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    <span>{event.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
