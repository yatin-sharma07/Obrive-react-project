import ActivityStream from '@/components/dashboard/ActivityStream'

import React from 'react'
import { useDashboardData } from '../../useDashboardData'
import Header from '../components/Header'
import Projects from '../components/Projects'
import ProfileNotifications from '../components/ProfileNotifications'
import NearestEvents from '../components/NearestEvents'
import SkeletonLoading from '@/components/SkelitonLoading'
import { motion } from 'framer-motion'

const Dashboard = ({setActiveSection}:{
    setActiveSection:(key:string)=>void
}) => {
     const { projects, events, activities, user, loading, error, refetch } = useDashboardData('employee')
     const ProfileNotificationsComponent = ProfileNotifications as unknown as React.ComponentType

     if (loading) {
    return (
      <SkeletonLoading/>)}
  return (
   <motion.div
   initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{duration:0.7}}
>
     <div className="flex-1 overflow-hidden flex gap-2">
        
        {/* Middle  Content Area */}

        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <Header pageTitle="Employee Dashboard" userName={user?.name} />
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
              <Projects projects={projects} variant="dashboard"/>
            </div>

        </div>

        {/* Right Panel */}
        <div className="w-80 flex flex-col gap-2 overflow-hidden">


          <div className="m-2 p-1 w-80 text-white flex flex-col">
              <ProfileNotificationsComponent />
          </div>
         

          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <NearestEvents events={events}
             setActiveSection={setActiveSection} />
          </div>

          <div className="flex-1 min-h-0 bg-white rounded-lg p-3 overflow-y-auto text-black">
            <ActivityStream activities={activities} />
          </div>
        </div>

      </div>
   </motion.div>
  )
}

export default Dashboard