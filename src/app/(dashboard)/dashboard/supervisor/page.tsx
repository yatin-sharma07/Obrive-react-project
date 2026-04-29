'use client'

import {
  LayoutDashboard,
  FolderOpen,
  List,
  Menu
} from 'lucide-react'
import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Dashboard from './sections/Dashboard'
import SkeletonLoading from '@/components/SkelitonLoading'
import Projects from './sections/Projects'
import StickyNotes from './sections/StickyNotes'

export default function SupervisorDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [supportOpen, setSupportOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { label: 'Projects', icon: FolderOpen, key: 'projects' },
    { label: 'Sticky Notes', icon: List, key: 'sticky-notes' },
  ]

  return (
    <>
      <div className="contents md:flex md:h-full md:w-auto md:flex-col md:rounded-2xl">
        <Sidebar
          navItems={navItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setSupportOpen={setSupportOpen}
          mobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      <div className="flex w-full flex-1 min-w-0 flex-col gap-2 overflow-hidden">
        <div className="sticky top-2 z-30 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>

          <span className="text-sm font-semibold text-[#1a472a] capitalize">
            {activeSection === 'sticky-notes' ? 'Sticky Notes' : activeSection}
          </span>
        </div>

        {activeSection === 'dashboard' && (
          <Dashboard setActiveSection={setActiveSection} />
        )}
        {activeSection === 'projects' && (
          <Projects />
        )}
        {activeSection === 'sticky-notes' && (
          <StickyNotes />
        )}
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setSupportOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
            >
              x
            </button>

            <h2 className="text-center text-xl font-semibold text-[#073933] mb-4">
              Need Support?
            </h2>
            <p className="text-center text-sm text-gray-600">
              Contact our support team for assistance with your supervisor dashboard.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
