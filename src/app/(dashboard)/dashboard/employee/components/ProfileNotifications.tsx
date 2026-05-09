'use client'

import { ChevronDown, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import Image from 'next/image'
import UserPfp from '@/assets/images/employee/photo.png'
import { Calendar } from 'lucide-react'
// import { Bell } from 'lucide-react'
import Timer from './Timer'
import {useRouter} from "next/navigation"

type ProfileDropdownProps = {
  notificationCount?: number
  dateRange?: {
    start: string
    end: string
  }
}

export default function ProfileDropdown({
  notificationCount = 3,
  dateRange = {
    start: 'Nov 16, 2020',
    end: 'Dec 16, 2020',
  },
}: ProfileDropdownProps) {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiFetch('/auth/me');

        if (res.ok) {
          const data = await res.json();
          if (data?.success) {
            setUser(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const HandleRouting = () => {
    if (user?.id) {
      router.push(`/profile/${user.id}`);
    } else {
      router.push('/dashboard/employee');
    }
  };

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
          {/* <Bell className="w-4.5 h-4.5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )} */}
        </button>
 
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={UserPfp}
              alt="pfp"
              className="rounded-full object-cover w-full h-full"
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col items-start min-w-0">
          <span className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'Employee'}</span>
            {/* <span className="text-[10px] text-gray-500">Employee</span> */}
          </div>
          <ChevronDown className="w-3 h-3 text-gray-600 flex-shrink-0" />
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
{/* Dropdown */}
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 4-50"
    >
      <div className="space-y-4">

        {/* User Info */}
        <div className="flex items-center gap-3 pb-1 border-b border-gray-100 ">
          <div className="w-12 h-12 flex items-center rounded-full overflow-hidden">
            <Image
              src={UserPfp}
              alt="pfp"
              className="rounded-full object-cover w-full h-full"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {user?.name || 'Employee'}
            </h3>


          </div>
        </div>

        {/* Timer Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-2 border border-blue-100">
          <p className="text-xs font-medium text-blue-700 mb-2 justify-center flex">
            Work Time
          </p>

          <div className="flex justify-center">
            <Timer />
          </div>
        </div>

        {/* Profile Button */}
        <button
          onClick={HandleRouting}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
              <User className="h-4 w-4 text-blue-700" />
            </div>

            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">
                Profile
              </p>

              <p className="text-xs text-gray-500">
                Manage profile
              </p>
            </div>
          </div>

          <ChevronDown className="w-4 h-4 rotate-[-90deg] text-gray-400 group-hover:text-[blue-600] transition" />
        </button>

      </div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  )
}