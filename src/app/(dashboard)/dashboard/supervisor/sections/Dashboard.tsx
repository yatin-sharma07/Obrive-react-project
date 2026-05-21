import ActivityStream from '@/components/dashboard/ActivityStream'
import React from 'react'
import Header from '../components/Header'
import SkeletonLoading from '@/components/SkelitonLoading'
import { motion } from 'framer-motion'
import NearestEvents from '../components/NearestEvents'
import EmployeesList from '../components/EmployeesList'
import { useDashboardData } from '../../useDashboardData'
import { useSocket } from '@/context/SocketContext'

const Dashboard = ({setActiveSection}:{
    setActiveSection:(key:string)=>void
}) => {
     const { events, activities, user, workloadMembers, loading, refetch } = useDashboardData('supervisor')
     const { onlineUsers } = useSocket()

     // Filter workloadMembers to show only online ones
     const onlinePersons = (workloadMembers || [])
       .filter(member => onlineUsers.includes(Number(member.id)))
       .slice(0, 10); // Show top 10 online

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
            <NearestEvents 
              events={events}
              setActiveSection={setActiveSection} 
              onEventCreated={() => refetch()}
            />
          </div>

          <div className="min-h-[220px] bg-white rounded-lg p-3 overflow-y-auto text-black xl:flex-1 xl:min-h-0">
            {/* ActivityStream commented out for supervisor - using live OnlinePersons */}
            {/* <ActivityStream activities={activities} /> */}
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-900">Online Persons</h3>
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="flex-1 space-y-3">
                {onlinePersons.length > 0 ? (
                  onlinePersons.map((person, idx) => (
                    <div key={person.id || idx} className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                          {person.pfp || person.avatar_url ? (
                            <img src={person.pfp || person.avatar_url} alt={person.name} className="h-full w-full object-cover" />
                          ) : (
                            person.name.split(' ').map((n: string) => n[0]).join('')
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-gray-900">{person.name}</p>
                        <p className="truncate text-[10px] text-gray-500">{person.job_title || person.department || 'Team Member'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                    <p className="text-xs text-gray-500">No employees online</p>
                    <p className="text-[10px] text-gray-400 mt-1 italic">
                      Live status from Socket.io
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
   </motion.div>
  )
}

export default Dashboard
