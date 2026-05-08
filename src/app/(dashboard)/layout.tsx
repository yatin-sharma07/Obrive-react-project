'use client'

import { ReactNode } from 'react'

import { TimerProvider }
from '@/context/TimerContext'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({
  children
}: DashboardLayoutProps) {

  return (

    <TimerProvider>

      <div className="flex min-h-screen w-full bg-[#F4F9FD] gap-2 p-2 md:h-screen">

        {children}

      </div>

    </TimerProvider>
  )
}