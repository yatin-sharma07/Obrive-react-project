'use client'

import { CalendarDays, ChevronDown, ChevronRight, ChevronUp, Calendar } from 'lucide-react'
import Image from 'next/image'

export type ProjectPriority = 'Low' | 'Medium' | 'High'
type ProjectCardVariant = 'dashboard' | 'projects'

export interface ProjectAssignee {
  id: string
  name: string
  avatarUrl?: string
  role?: string
}

export interface ProjectItem {
  id: string
  code: string
  name: string
  createdAtLabel: string
  priority: ProjectPriority
  allTasks: number
  activeTasks: number
  assignees: ProjectAssignee[]
  extraAssigneesCount?: number
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

function priorityUI(priority: ProjectPriority) {
  switch (priority) {
    case 'High':
      return { label: 'High', icon: ChevronUp, color: 'text-red-500' }
    case 'Medium':
      return { label: 'Medium', icon: ChevronUp, color: 'text-amber-500' }
    case 'Low':
    default:
      return { label: 'Low', icon: ChevronDown, color: 'text-green-500' }
  }
}

export default function ProjectCard({
  project,
  variant,
  onSelectProject,
}: {
  project: ProjectItem
  variant: ProjectCardVariant
  onSelectProject?: (project: ProjectItem) => void
}) {
  const p = priorityUI(project.priority)
  const PriorityIcon = p.icon

  const visibleAssignees = project.assignees.slice(0, 3)
  const extra =
    (project.extraAssigneesCount ?? 0) +
    Math.max(0, project.assignees.length - visibleAssignees.length)

  if (variant === 'dashboard') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-3">
        <div className="flex flex-col md:flex-row">

          {/* LEFT SECTION */}
          <div className="flex-[1.2] p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">

              {/* ICON */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-amber-200/40 rounded-full blur-xl transform -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-6 h-6 bg-purple-500 rounded-full blur-lg opacity-60 transform translate-x-1/2 -translate-y-1/2" />
                <div className="z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg  flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-tr from-amber-400 via-amber-200 to-purple-500 rounded-lg" />
                </div>
              </div>

              <div className="min-w-0 flex-1">

                {/* KEEP SAME SIZE */}
                <p className="text-xs md:text-[10px] font-medium text-slate-400 tracking-wider mb-1 uppercase">
                  {project.code}
                </p>

                {/* KEEP SAME SIZE */}
                <h3 className="text-sm sm:text-sm font-black text-[#073933] leading-tight mb-3">
                  {project.name}
                </h3>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-xs">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{project.createdAtLabel}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs sm:text-xs font-semibold">
                    <PriorityIcon className={`w-4 h-4 ${p.color}`} />
                    <span className={p.color}>{p.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="hidden md:block w-[1px] bg-gray-200 my-4" />

          {/* RIGHT SECTION */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">

            <h4 className="text-sm sm:text-sm font-medium text-[#073933] mb-4">
              Project Data
            </h4>

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-xs text-slate-400">All tasks</p>
                <p className="text-lg sm:text-sm font-bold text-[#073933]">
                  {project.allTasks}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Active</p>
                <p className="text-lg sm:text-sm font-bold text-[#073933]">
                  {project.activeTasks}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Assignees</p>

                <div className="flex items-center">
                  {visibleAssignees.map((a, idx) => (
                    <div
                      key={a.id}
                      className="relative w-7 h-7 sm:w-7 sm:h-7 rounded-full border-2 border-white overflow-hidden"
                      style={{ marginLeft: idx === 0 ? 0 : -8 }}
                    >
                      {a.avatarUrl ? (
                        <Image src={a.avatarUrl} alt={a.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                          {initials(a.name)}
                        </div>
                      )}
                    </div>
                  ))}

                  {extra > 0 && (
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4293f5] text-white flex items-center justify-center text-[9px] font-bold border-2 border-white"
                      style={{ marginLeft: -8 }}
                    >
                      +{extra}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'projects') {
    return (
      <div
        onClick={() => onSelectProject?.(project)}
        className="rounded-xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer transition-all
                   bg-white border border-transparent
                   hover:border-r-4 hover:border-r-teal-600 hover:bg-[#eef4f8]"
      >
        <div>
          <p className="text-xs text-gray-400">{project.code}</p>
          <p className="text-sm font-semibold text-[#1a1a1a]">
            {project.name}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectProject?.(project)
          }}
          className="text-[11px] font-semibold hover:text-teal-800 flex items-center gap-1 mt-2"
        >
          View details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }
}