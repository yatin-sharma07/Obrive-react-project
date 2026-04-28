'use client'

import { ReactNode } from 'react'


interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-[#F4F9FD] gap-2 p-2">

      {children}

    </div>
  )
}