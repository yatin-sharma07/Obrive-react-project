'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface WorkloadMember {
  id: number
  name: string
  job_title?: string
  department?: string
  status?: string
  avatar_url?: string
  pfp?: string
}

interface WorkloadSectionProps {
  members?: WorkloadMember[]
}

const WorkloadSection: React.FC<WorkloadSectionProps> = ({ members = [] }) => {
  return (
    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-100 w-full">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#073933]">Workload</h2>
        <button className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
          View all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative flex flex-col items-center rounded-2xl bg-[#F4F9FD] p-4 text-center transition-all hover:shadow-md border border-transparent hover:border-blue-100"
          >
            {/* Avatar with status circle */}
            <div className="relative mb-2">
              <div className={`relative h-14 w-14 overflow-hidden rounded-full p-0.5 border-2 ${
                member.status === 'online' ? 'border-emerald-500' : 'border-slate-300'
              }`}>
                <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-200">
                  <Image
                    src={member.pfp || member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <h3 className="mb-0.5 text-sm font-bold text-[#073933] group-hover:text-blue-600 transition-colors truncate w-full px-1">
              {member.name}
            </h3>
            <p className="mb-2 text-[11px] font-medium text-slate-400 truncate w-full px-1">
              {member.job_title || 'Team Member'}
            </p>

            <div className="rounded-lg bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 shadow-sm border border-slate-50">
              {(() => {
                const title = (member.job_title || '').toLowerCase()
                if (title.includes('junior')) return 'Junior'
                if (title.includes('senior')) return 'Senior'
                if (title.includes('lead')) return 'Lead'
                return member.department || 'Middle'
              })()}
            </div>
          </motion.div>
        ))}

        {members.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-400 text-sm italic">
            No team members found.
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkloadSection
