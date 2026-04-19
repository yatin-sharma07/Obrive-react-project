'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import Image from 'next/image'
import UserPfp from '@/assets/images/employee/photo.png'

export default function ProfileDropdown() {
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-gray-100 rounded-2xl px-4 py-3"
      >
        <div className="flex items-center gap-3">
          
          <Image
            src={UserPfp}
            alt="pfp"
            className="w-10 h-10 rounded-full object-cover"
          />

          <span className="text-lg font-semibold text-[#073933]">
            {user?.name || 'Loading...'}
          </span>
        </div>

        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

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
              
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Role:</span> {user?.role}</p>
              <p><span className="font-semibold">Job:</span> {user?.job_title}</p>
              <p><span className="font-semibold">Phone:</span> {user?.phone_number}</p>

              {user?.biography && (
                <p className="text-gray-500 text-xs mt-2">
                  {user.biography}
                </p>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}