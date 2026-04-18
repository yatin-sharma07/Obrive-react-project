'use client'

import Header from '@/components/dashboard/Header'
import Projects from '@/components/dashboard/Projects'
import ProfileNotifications from '@/components/dashboard/ProfileNotifications'
import { useDashboardData } from '../useDashboardData'

export default function ClientDashboard() {
  const { projects, user, loading, error, refetch } = useDashboardData('client')

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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          <p className="font-bold">Error loading dashboard</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => refetch()}
            className="text-xs bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-row gap-2 overflow-hidden">


            <div className="flex-1 overflow-hidden flex flex-col gap-2">
                <Header pageTitle="Client Dashboard" userName={user?.name} />               
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