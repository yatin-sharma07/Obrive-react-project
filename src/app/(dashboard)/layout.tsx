'use client'

import { ReactNode } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-[#ebf1fa] gap-2 p-2">
      
      {/* Left Sidebar */}
      <div className="rounded-2xl flex flex-col">
        <Sidebar />
      </div>

      {/* Page Content - Each role renders its own page */}
      {children}

    </div>
  )
}