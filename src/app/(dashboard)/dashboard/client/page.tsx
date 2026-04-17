'use client'

import Header from '@/components/dashboard/Header'
import Projects from '@/components/dashboard/Projects'
import ProfileNotifications from '@/components/dashboard/ProfileNotifications'
import { useDashboardData } from '../useDashboardData'

export default function ClientDashboard() {
  const { projects, loading } = useDashboardData('client')

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-row gap-2 overflow-hidden">


            <div className="flex-1 overflow-hidden flex flex-col gap-2">
                <Header pageTitle="Client Dashboard" userName="Evan" />               
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
                    {/* Client only sees projects */}
                    <Projects projects={projects} />
                  </div>
            </div> 

        
            <div className="w-80 flex flex-col gap-2 overflow-hidden">
              <div className="flex-none">
                <ProfileNotifications />
              </div>
            </div>


    </div>
  )
}