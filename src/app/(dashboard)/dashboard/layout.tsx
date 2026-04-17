'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigation = [
    { name: 'Employee', href: '/dashboard/employee' },
    { name: 'Admin', href: '/dashboard/admin' },
    { name: 'HR', href: '/dashboard/hr' },
    { name: 'Client', href: '/dashboard/client' },
  ]

  return (
    <div className="flex h-screen w-screen  bg-[#ebf1fa] ">
      
      {/* Left Sidebar */}
      <div className="m-2 p-3 w-40 text-white border-2 bg-white   rounded-sm ">
        <h1 className="text-2xl font-bold mb-8 pb-4">Obrive</h1>
        
        <nav className="space-y-2">
 
        </nav>
      </div>

      {/* Center Dashboard Area */}
      <div className="m-2 grow text-white  bg-transparent flex flex-col relative">



                <div className=" h-30 text-white  relative">
                
                    <div className="grow">
                        <input  type="text" placeholder="Search..." className="w-80 h-7 pl-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-black text-[9px]" />
                    </div>

                    <span className="text-[10px] text-gray-400 absolute bottom-11 ">Welcome back, Evan!</span>
                    <h1 className="text-2xl font-semibold text-black absolute bottom-3 ">Dashboard</h1>


                </div>

                <div className="p-1 grow flex-1 border-2 bg-white border-black  rounded-sm ">
                    <h2 className=" m-1 p-1 text-base font-extrabold text-black">Workload</h2>
                </div>


                <div className="grow flex-col flex  rounded-sm">
                <h2 className="mt-2 mb-2 text-black font-bold">Projects</h2>

                    <div className="p-1 grow flex-1 text-black bg-white border-black border-2  rounded-sm">
 
                    </div>

                </div>
 
      </div>

      {/* Right Panel */}
      <div className="m-2 p-1 w-80 text-white border-2 bg-white border-black flex flex-col">

                <div className="m-1 p-1  text-white border-2 bg-white border-black  flex flex-col relative">

                    <div className="h-15  flex flex-row border-2 border-black relative">

                        <div className=" h-10 w-10 border-2 border-black bg-amber-500 absolute right-45 top-0">
                        </div>

                        <div className=" h-10 w-40 border-2 border-black bg-amber-200 absolute right-0 top-0">
                        </div>

                    </div>

                    <div className="h-15 border-2 border-black bg-amber-800">
                    </div>

                </div>

                <div className="m-1 p-1 grow flex-1 text-white border-2 bg-white border-black">


                </div>

                <div className="m-1 p-1 grow flex-1 text-white border-2 bg-white border-black">


                </div>
                
                </div>

    </div>
  )
}