import ActivityStream from '@/components/dashboard/ActivityStream'
import React from 'react'
import { useDashboardData } from '../../useDashboardData'
import Projects from '../components/Projects'
import WorkloadSection from '../components/WorkloadSection'
import ProfileNotifications from '../components/ProfileNotifications'
import SkeletonLoading from '@/components/SkelitonLoading'
import { motion } from 'framer-motion'
import NearestEvents from '../components/NearestEvents'

const Dashboard = ({ setActiveSection }: {
  setActiveSection: (key: string) => void
}) => {
  const { projects, events, activities, workloadMembers, user, loading, error, refetch } = useDashboardData('employee')

  if (loading) return <SkeletonLoading />

  return (
    // h-screen ensures the dashboard fills the entire viewport
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full flex flex-col overflow-hidden bg-[#F4F9FD] "
    >
      {/* Top Header Row (Notifications / User info) */}

      <div className="flex-1 flex flex-row gap-4 overflow-hidden min-h-0">
        
        {/* LEFT SIDE: Projects Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
   
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide w-full">
            <WorkloadSection members={workloadMembers} />
            <Projects projects={projects} variant="dashboard" />
          </div>
        </div>

        {/* RIGHT PANEL: Fixed Width, Full Height Split */}
        <div className="w-80 flex flex-col gap-4 h-full min-h-0">
          
          {/* Top Half: Nearest Events */}
          <div className="flex-1 min-h-0 bg-white rounded-xl flex flex-col shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Upcoming Events</h3>
              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{events?.length || 0}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
              <NearestEvents events={events} setActiveSection={setActiveSection} />
            </div>
          </div>

          {/* Bottom Half: Activity Stream */}
          <div className="flex-1 min-h-0 bg-white rounded-xl flex flex-col shadow-sm border border-slate-100 overflow-hidden">
             <div className="px-4 py-3 border-b border-slate-50">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Recent Activity</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
              <ActivityStream activities={activities} />
            </div>
          </div>

        </div> {/* End of Right Panel */}
      </div> 
    </motion.div>
  )
}

export default Dashboard
