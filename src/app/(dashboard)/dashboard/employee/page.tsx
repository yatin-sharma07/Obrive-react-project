'use client'

import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Palmtree,
  List
} from 'lucide-react'
import supportImg from "@/assets/images/employee/illustration.png"
import { useDashboardData } from '../useDashboardData'
import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Dashboard from './sections/Dashboard'
import SkeletonLoading from '@/components/SkelitonLoading'
import NearestEventsSection from './sections/NearestEventsSection'
import ProfileNotifications from './components/ProfileNotifications'
import Notes from './sections/Notes'
import ProjectsSection from './sections/ProjectsSection'

export default function EmployeeDashboard() {
  const {  loading, error, refetch } = useDashboardData('employee')
  const [activeSection
    , setActiveSection] = useState('dashboard')  
  const[supportOpen,setSupportOpen]=useState(false)

  const navItems=[
    {label:'Dashboard', icon:LayoutDashboard, key:'dashboard'},
    {label:'Projects', icon:FolderOpen, key:'projects'},
    {label:'Calender', icon:Calendar, key:'calender'},
    {label:'Vacations', icon:Palmtree, key:'Vacations'},
    {label:"Sticky Notes", icon:List, key:'tasks'},
   

  ]

  if (loading) {
    return (
      <SkeletonLoading/>
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
    <>
    
    <div className="flex rounded-2xl flex-col">
          <Sidebar
            navItems={navItems}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setSupportOpen={setSupportOpen}
          />
    </div>

    <div className="flex-1 flex flex-col gap-2 overflow-hidden">
      
    {activeSection==='dashboard'&&(
      <Dashboard setActiveSection={setActiveSection}/>
    )}
    {activeSection==='projects'&&(
      <ProjectsSection/>
    )}
    {activeSection==='calender'&&(
      <div className="p-6">Calender Section - Coming Soon!</div>
    )}
  
    {activeSection ==='events'&&(
     <NearestEventsSection/>
    )}
    {activeSection ==='tasks'&&(
     <Notes/>
    )}

    </div>
   {supportOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    
    {/* Modal */}
    <div className="relative w-[420px] bg-white rounded-2xl p-6 shadow-xl">

      {/* Close Button */}
      <button
        onClick={() => setSupportOpen(false)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold text-center text-[#073933] mb-4">
        Need some Help?
      </h2>

      {/* Image */}
      <div className="w-full h-40 rounded-xl bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={supportImg.src}
          alt="support"
          className="object-contain h-full"
        />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-5">
        Describe your question and our specialists will answer you within 24 hours.
      </p>

      {/* Subject */}
      <div className="mb-4">
        <label className="text-sm text-gray-500 mb-1 block">
          Request Subject
        </label>
        <select className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#6c63ff]">
          <option>Technical difficulties</option>
          <option>Billing issue</option>
          <option>General inquiry</option>
        </select>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="text-sm text-gray-500 mb-1 block">
          Description
        </label>
        <textarea
          placeholder="Add some description of the request"
          className="w-full border rounded-lg px-3 py-2 text-sm h-24 outline-none focus:ring-2 focus:ring-[#6c63ff]"
        />
      </div>

      {/* Button */}
      <button className="w-full bg-[#073933] text-white py-3 rounded-xl font-medium hover:bg-[#0a4a42] transition">
        Send Request
      </button>
    </div>
  </div>
)}

   </>)
}