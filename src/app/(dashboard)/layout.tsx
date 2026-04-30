'use client'

import { ReactNode } from 'react'


interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#F4F9FD] gap-2 p-2 md:h-screen">

      {children}

    </div>
  )
}
