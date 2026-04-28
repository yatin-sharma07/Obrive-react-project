/*'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

import { dashboardConfigs, type UserRole } from '@/constants/dashboardConfig'
import { useDashboardData } from '../useDashboardData'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const params = useParams()
  const role = (params?.role as UserRole) || 'hr' // Default to HR
  
  const config = dashboardConfigs[role]
  const { workloadMembers, projects, events, activities, user, loading, error } = useDashboardData(role)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-row gap-2 overflow-hidden">

      {/* Center Dashboard Area }
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        
        <Header pageTitle={`${role.toUpperCase()} Dashboard`} userName={user?.name} />

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
          
          <Workload members={workloadMembers} />
          <Projects projects={projects} />
          
          {children}
        </div>
      </div>

      {/* Right Panel }
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
}*/import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page