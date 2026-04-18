'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Palmtree,
  Users,
  MessageCircle,
  Info,
  LogOut,
} from 'lucide-react'
import { apiFetch } from '@/lib/api'
import PrimaryLogo from '@/components/shared/logo/PrimaryLogo'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      router.push('/')
    }
  }

  const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard/hr', // or dynamically set based on user role
  },
    {
      label: 'Projects',
      icon: FolderOpen,
      href: '/dashboard/projects',
    },
    {
      label: 'Calendar',
      icon: Calendar,
      href: '/dashboard/calendar',
    },
    {
      label: 'Vacations',
      icon: Palmtree,
      href: '/dashboard/vacations',
    },
    {
      label: 'Employees',
      icon: Users,
      href: '/dashboard/employees',
    },
    {
      label: 'Messenger',
      icon: MessageCircle,
      href: '/dashboard/messenger',
    },
    {
      label: 'Info Portal',
      icon: Info,
      href: '/dashboard/info',
    },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-50'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 m-2 rounded-lg shadow-sm`}>
      
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/hr" className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <PrimaryLogo width={isCollapsed ? 40 : 60} height={isCollapsed ? 28 : 42} />
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              title="Collapse"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              title="Expand"
            >
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-[#1a472a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Support Section */}
      {!isCollapsed && (
        <div className="mx-4 mb-4 p-3 bg-[#D9F2F2] rounded-2xl flex flex-col items-center">
          <div className="relative w-full h-32 mb-2">
            <Image
              src="/images/otter.png"
              alt="Support Otter"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button className="w-full bg-[#073933] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:bg-[#0a4a42] transition-colors">
            <MessageCircle className="w-4 h-4" />
            Support
          </button>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}
