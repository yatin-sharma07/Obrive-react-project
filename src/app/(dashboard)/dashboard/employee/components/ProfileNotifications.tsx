'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import Image from 'next/image'
import UserPfp from '@/assets/images/employee/photo.png'
import { Calendar } from 'lucide-react'
import { Bell } from 'lucide-react'
import { Timer } from './Timer'

export default function ProfileDropdown( 
  notificationCount = 3,    
       dateRange = {
    start: 'Nov 16, 2020',
    end: 'Dec 16, 2020',
  }
  , ) {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const res = await apiFetch('/api/users')

        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  return ( 
    <div className="relative">

      {/* Top Profile Bar */}
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <button
          // onClick={onNotificationClick}
          className="p-1 hover:bg-gray-100 rounded-lg transition relative"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
 
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-[10px] font-semibold">
            
          <Image
            src={UserPfp}
            alt="pfp"
            className="rounded-full object-cover"
          />
          </div>
          <span className="text-xs font-semibold text-gray-900">{user?.name || 'Karn'}</span>
          <ChevronDown className="w-3 h-3 text-gray-600" />
        </button>
      </div>
 
      <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
        <Calendar className="w-3 h-3 text-gray-500" />
        <span className="truncate">
          {dateRange.start} - {dateRange.end}
        </span>
      </div>
    </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-white rounded-2xl shadow-lg p-4 z-50"
          >
            
            <div className="space-y-2 text-sm text-gray-700">

              <Timer />

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}