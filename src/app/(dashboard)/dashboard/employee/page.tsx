'use client'

import Header from '@/components/dashboard/Header'
import Projects from '@/components/dashboard/Projects'
import NearestEvents from '@/components/dashboard/NearestEvents'
import ActivityStream from '@/components/dashboard/ActivityStream'
import ProfileNotifications from '@/components/dashboard/ProfileNotifications'
import { useDashboardData } from '../useDashboardData'

export default function EmployeeDashboard() {
  const { projects, events, activities, loading } = useDashboardData('employee')

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-hidden">
      

      <div className="flex-1 overflow-hidden flex gap-2">
        
        {/* Middle  Content Area */}

        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
           <Header pageTitle="Employee Dashboard" userName="Evan" />
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
          <Projects projects={projects} />
        </div>

      </div>

        {/* Right Panel */}
        <div className="w-80 flex flex-col gap-2 overflow-hidden">
          
          <div className="flex-none">
            <ProfileNotifications />
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <NearestEvents events={events} />
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <ActivityStream activities={activities} />
          </div>
        </div>

      </div>

    </div>
  )
}