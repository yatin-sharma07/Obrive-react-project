'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

type Level = 'Junior' | 'Middle' | 'Senior'

export interface WorkloadMember {
  id: string
  name: string
  role: string
  level: Level
  avatarUrl?: string
}

interface WorkloadProps {
  members?: WorkloadMember[]
  onViewAll?: () => void
}

const defaultMembers: WorkloadMember[] = [
  { id: '1', name: 'Shawn Stone', role: 'UI/UX Designer', level: 'Middle' },
  { id: '2', name: 'Randy Delgado', role: 'UI/UX Designer', level: 'Junior' },
  { id: '3', name: 'Emily Tyler', role: 'Copywriter', level: 'Middle' },
  { id: '4', name: 'Louis Castro', role: 'Copywriter', level: 'Middle' },
  { id: '5', name: 'Blake Silva', role: 'iOS Developer', level: 'Senior' },
  { id: '6', name: 'Joel Phillips', role: 'UI/UX Designer', level: 'Middle' },
  { id: '7', name: 'Wayne Marsh', role: 'UI/UX Designer', level: 'Junior' },
  { id: '8', name: 'Oscar Holloway', role: 'UI/UX Designer', level: 'Junior' },
]

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

export default function Workload({ members = defaultMembers, onViewAll }: WorkloadProps) {
  return (
    <section className="bg-white rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#1a472a]">Workload</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
        >
          View all <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-[#eef7ff] rounded-lg p-2 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full ring-2 ring-teal-700 ring-offset-2 ring-offset-[#eef7ff] overflow-hidden bg-white flex items-center justify-center">
              {m.avatarUrl ? (
                <Image
                  src={m.avatarUrl}
                  alt={m.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[9px] font-bold text-gray-600">{initials(m.name)}</span>
              )}
            </div>

            <p className="mt-2 text-xs font-bold text-[#1a472a] line-clamp-1">{m.name}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{m.role}</p>

            <span className="mt-2 text-[9px] px-2 py-0.5 rounded-full border border-gray-200 bg-white/70 text-gray-600">
              {m.level}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}