'use client'

import Header from '@/components/dashboard/Header'
import Workload from '@/components/dashboard/Workload'
import Projects from '@/components/dashboard/Projects'
import ActivityStream from '@/components/dashboard/ActivityStream'
import ProfileNotifications from '@/components/dashboard/ProfileNotifications'
import { useDashboardData } from '../useDashboardData'

export default function AdminDashboard() {
  const { workloadMembers, projects, activities, loading } = useDashboardData('admin')

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-row gap-2 overflow-hidden">
      
      {/* Center Dashboard Area */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">

            <Header pageTitle="Admin Dashboard" userName="Evan" />

              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
                <Workload members={workloadMembers} />
                <Projects projects={projects} />
              </div>
      </div>

      {/* // left side panel */}
      <div className=" overflow-hidden flex gap-2">

        <div className="w-80 flex flex-col gap-2 overflow-hidden">
          
          <div className="flex-none">
            <ProfileNotifications />
          </div>

          {/* Admin doesn't see events */}
          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <ActivityStream activities={activities} />
          </div>
        </div>

      </div>

    </div>
  )
}