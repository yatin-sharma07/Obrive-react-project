'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import supportImg from "@/assets/images/sidebar/support.png"
import { MessageCircle, LogOut, X } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import PrimaryLogo from '@/components/shared/logo/PrimaryLogo'

type NavItem = {
  label: string
  icon: any
  key: string
}

export default function Sidebar({ navItems, activeSection, setActiveSection, setSupportOpen,
  mobileOpen = false,
  onMobileClose,
}: {
  navItems: NavItem[]
  activeSection: string
  setActiveSection: (key: string) => void
  setSupportOpen:(key:boolean)=>void
  mobileOpen?: boolean
  onMobileClose?: () => void
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
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      <div className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-2 left-2 z-50 w-[min(18rem,calc(100vw-1rem))] transition-transform duration-300 md:hidden`}>
        <div className="h-full rounded-lg bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-full flex-col">
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <PrimaryLogo width={60} height={42} />
                </Link>

                <button
                  type="button"
                  onClick={onMobileClose}
                  className="rounded-lg p-2 hover:bg-gray-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6 scrollbar-hide">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = activeSection === item.key

                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveSection(item.key)
                      onMobileClose?.()
                    }}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
 active
  ? 'bg-[#CAEDE666] text-[#074139] font-semibold'
  : 'text-gray-400 font-normal hover:bg-gray-100'
}`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div
              className="mx-4 mb-4 flex h-60 flex-col justify-end rounded-2xl bg-[#D9F2F2] sm:bg-fill  bg-center bg-no-repeat p-3"
              style={{ backgroundImage: `url(${supportImg.src})` }}
            >
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#073933] py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0a4a42]"
                onClick={() => {
                  setSupportOpen(true)
                  onMobileClose?.()
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Support
              </button>
            </div>

            <div className="border-t border-gray-100 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isCollapsed ? 'w-20' : 'w-64'} hidden h-full bg-white border-r border-gray-200 md:flex md:flex-col transition-all duration-300 rounded-lg shadow-sm`}>

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

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeSection === item.key

            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
  active
    ? 'bg-[#CAEDE666] text-[#074139] font-bold'
    : 'text-gray-400 font-normal hover:bg-gray-100'
}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && (
                  <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {!isCollapsed && (
          <div className="mx-4 mb-4 p-3 bg-[#D9F2F2] rounded-2xl flex flex-col bg-no-repeat bg-cover bg-center h-70 justify-end relative" style={{ backgroundImage: `url(${supportImg.src})` }} >
            <button className="w-full bg-[#073933] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:bg-[#0a4a42] transition-colors"
            onClick={() => {
              setSupportOpen(true)
            }}
           >
              <MessageCircle className="w-4 h-4" />
              Support
            </button>
          </div>
        )}

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
    </>
  )
}




