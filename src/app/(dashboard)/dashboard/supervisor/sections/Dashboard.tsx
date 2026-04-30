import ActivityStream from '@/components/dashboard/ActivityStream'
import React from 'react'
import Header from '../components/Header'
import SkeletonLoading from '@/components/SkelitonLoading'
import { motion } from 'framer-motion'
import NearestEvents from '../components/NearestEvents'
import EmployeesList from '../components/EmployeesList'
import { useDashboardData } from '../../useDashboardData'

const Dashboard = ({setActiveSection}:{
    setActiveSection:(key:string)=>void
}) => {
     const { events, activities, user, loading } = useDashboardData('supervisor')

     if (loading) {
    return (
      <SkeletonLoading/>)}
  return (
   <motion.div
   className="h-full min-h-0"
   initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{duration:0.7}}
>
     <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden xl:flex-row">
        
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
          <Header pageTitle="Supervisor Dashboard" userName={user?.name} />
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-0 xl:pr-2">
              <EmployeesList setActiveSection={setActiveSection} />
            </div>

        </div>

        <div className="flex w-full flex-col gap-3 overflow-hidden xl:w-80 xl:min-w-[20rem]">

          <div className="min-h-[220px] bg-white rounded-lg p-3 overflow-y-auto text-black xl:flex-1 xl:min-h-0">
            <NearestEvents events={events}
             setActiveSection={setActiveSection} />
          </div>

          <div className="min-h-[220px] bg-white rounded-lg p-3 overflow-y-auto text-black xl:flex-1 xl:min-h-0">
            <ActivityStream activities={activities} />
          </div>
        </div>

      </div>
   </motion.div>
  )
}

export default Dashboard
