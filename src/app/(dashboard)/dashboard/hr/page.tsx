'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import ActivityStream from '@/components/dashboard/ActivityStream'
import NearestEvents from '@/components/dashboard/NearestEvents'
import Workload from '@/components/dashboard/Workload'
import Projects from '@/components/dashboard/Projects'
import ProfileNotifications from '@/components/dashboard/ProfileNotifications'
import { dashboardConfigs, type UserRole } from '@/constants/dashboardConfig'
import { useDashboardData } from '../useDashboardData'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const params = useParams()
  const role = (params?.role as UserRole) || 'hr' // Default to HR
  
  const config = dashboardConfigs[role]
  const { workloadMembers, projects, events, activities } = useDashboardData(role)

  return (
    <div className="flex-1 flex flex-row gap-2 overflow-hidden">

      {/* Center Dashboard Area */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        
        <Header pageTitle={`${role.toUpperCase()} Dashboard`} userName="Evan" />

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
          
          <Workload members={workloadMembers} />
          <Projects projects={projects} />
          
          {children}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 flex flex-col gap-2 overflow-hidden">
        
        {config.showProfileNotifications && (
          <div className="flex-none">
            <ProfileNotifications />
          </div>
        )}

        {config.showNearestEvents && (
          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <NearestEvents events={events} />
          </div>
        )}

        {config.showActivityStream && (
          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <ActivityStream activities={activities} />
          </div>
        )}
      </div>

    </div>
  )
}