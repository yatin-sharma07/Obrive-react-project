'use client'

import {
  LayoutDashboard,
  FolderOpen,
  List,
  Menu,
  Calendar
} from 'lucide-react'
import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Calender from '@/components/dashboard/Calender'
import Dashboard from './sections/Dashboard'
import Projects from './sections/Projects'
import StickyNotes from './sections/StickyNotes'
import Leaves from './sections/Leaves'
import supportImg from "@/assets/images/employee/illustration.png"

export const dynamic = 'force-dynamic'

export default function SupervisorDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [supportOpen, setSupportOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { label: 'Projects', icon: FolderOpen, key: 'projects' },
    { label: 'Calender', icon: Calendar, key: 'calender' },
    { label: 'Leaves', icon: Calendar, key: 'leaves' },
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
        {activeSection === 'calender' && (
          <Calender />
        )}
        {activeSection === 'leaves' && (
          <Leaves />
        )}
        {activeSection === 'sticky-notes' && (
          <StickyNotes />
        )}
      </div>

      {supportOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
    
    {/* Modal */}
    <div className="relative w-full max-w-[420px] bg-white rounded-2xl p-6 shadow-xl">

      {/* Close Button */}
      <button
        onClick={() => setSupportOpen(false)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold text-center text-[#073933] mb-4">
        Need some Help?
      </h2>

      {/* Image */}
      <div className="w-full h-40 rounded-xl bg-white flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={supportImg.src}
          alt="support"
          className="object-contain h-full"
        />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-5">
        Describe your question and our specialists will answer you within 24 hours.
      </p>

      {/* Subject */}
      <div className="mb-4">
        <label className="text-sm text-gray-500 mb-1 block">
          Request Subject
        </label>
        <select className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6c63ff]">
          <option>Technical difficulties</option>
          <option>Billing issue</option>
          <option>General inquiry</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="text-sm text-gray-500 mb-1 block">
          Description
        </label>
        <textarea
          placeholder="Add some description of the request"
          className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:ring-2 focus:ring-[#6c63ff]"
        />
      </div>

      {/* Button */}
      <button className="w-full bg-[#073933] text-white py-3 rounded-xl font-medium hover:bg-[#0a4a42] transition">
        Send Request
      </button>
    </div>
  </div>
      )}
    </>
  )
}

