'use client'

import { ChevronDown, User, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import Image from 'next/image'
import UserPfp from '@/assets/images/employee/photo.png'
import Timer from './Timer'
import { useRouter } from 'next/navigation'

type ProfileDropdownProps = {
  notificationCount?: number
  dateRange?: {
    start: string
    end: string
  }
}

type UserData = {
  id?: string | number
  name?: string
}

export default function ProfileDropdown({
  notificationCount = 3,
  dateRange = {
    start: 'Nov 16, 2020',
    end: 'Dec 16, 2020',
  },
}: ProfileDropdownProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiFetch('/auth/me')

        if (res.ok) {
          const data = await res.json()
          if (data?.success) {
            setUser(data.data)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleRouting = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`)
      return
    }

    router.push('/dashboard/employee')
  }

  return (
    <div className="relative">
      <div>
        <div className="mb-2 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-gray-100"
            aria-label={`Open profile menu${notificationCount > 0 ? ` with ${notificationCount} notifications` : ''}`}
          >
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={UserPfp}
                alt="Profile picture"
                className="h-full w-full rounded-full object-cover"
                width={32}
                height={32}
              />
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <span className="truncate text-xs font-semibold text-gray-900">
                {user?.name || 'Employee'}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 flex-shrink-0 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3 text-gray-500" />
          <span className="truncate">
            {dateRange.start} - {dateRange.end}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-1">
                <div className="flex h-12 w-12 items-center overflow-hidden rounded-full">
                  <Image
                    src={UserPfp}
                    alt="Profile picture"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {user?.name || 'Employee'}
                  </h3>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-2">
                <p className="mb-2 flex justify-center text-xs font-medium text-blue-700">
                  Work Time
                </p>

                <div className="flex justify-center">
                  <Timer />
                </div>
              </div>

              <button
                type="button"
                onClick={handleRouting}
                className="group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 transition group-hover:bg-blue-200">
                    <User className="h-4 w-4 text-blue-700" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">Profile</p>
                    <p className="text-xs text-gray-500">Manage profile</p>
                  </div>
                </div>

                <ChevronDown className="h-4 w-4 rotate-[-90deg] text-gray-400 transition group-hover:text-blue-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
