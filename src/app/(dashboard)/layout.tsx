'use client'

import { ReactNode } from 'react'


interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-[#ebf1fa] gap-2 p-2">

      {/* Left Sidebar */}
    

      {/* Page Content - Each role renders its own page */}
      {children}

    </div>
  )
}