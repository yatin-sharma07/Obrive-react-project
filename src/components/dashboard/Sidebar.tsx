'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import supportImg from "@/assets/images/sidebar/support.png"

import {
  MessageCircle,
  LogOut,
} from 'lucide-react'

import { apiFetch } from '@/lib/api'
import PrimaryLogo from '@/components/shared/logo/PrimaryLogo'

type NavItem = {
  label: string
  icon: any
  key: string
}

export default function Sidebar({
  navItems,
  activeSection,
  setActiveSection,
  setSupportOpen,
}: {
  navItems: NavItem[]
  activeSection: string
  setActiveSection: (key: string) => void
  setSupportOpen:(key:boolean)=>void
}) {
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
      router.push('/employee-login')
    }
  }

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 m-2 rounded-lg shadow-sm`}>

      {/* Logo Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/" className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <PrimaryLogo width={isCollapsed ? 40 : 60} height={isCollapsed ? 28 : 42} />
          </Link>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeSection === item.key

          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-[#1a472a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Support Section */}
      {!isCollapsed && (
        <div
          className="
mx-4 mb-4 p-3 bg-[#D9F2F2] rounded-2xl flex flex-col  bg-no-repeat bg-cover bg-center h-70 justify-end relative"
          style={{
            backgroundImage: `url(${supportImg.src})`,
          }}
        >
          <button className="w-full bg-[#073933] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:bg-[#0a4a42] transition-colors"
          onClick={()=>{
              console.log("Support Opened")
            setSupportOpen(true)
          }
          
            
          }
         >
            <MessageCircle className="w-4 h-4" />
            Support
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  )
}




