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
  description?: string
  status?: string
  progress?: number | string
  completedTasks?: number
  startDate?: string
  endDate?: string
  tasks?: unknown[]
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
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-4">
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT SECTION */}
          <div className="flex-[1.2] p-8 lg:p-10">
            <div className="flex items-start gap-5 lg:gap-6">
              {/* Project Icon/Logo */}
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                 {/* Visual decoration matching image */}
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white opacity-50" />
                 <div className="absolute bottom-0 left-0 w-full h-1/2 bg-amber-200/40 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
                 <div className="absolute top-0 right-0 w-8 h-8 bg-purple-500 rounded-full blur-xl opacity-60 transform translate-x-1/2 -translate-y-1/2" />
                 <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl shadow-sm border border-slate-50 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-tr from-amber-400 via-amber-200 to-purple-500" />
                 </div>
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <p className="text-base lg:text-lg font-medium text-slate-400 tracking-wider mb-1 uppercase">{project.code}</p>
                <h3 className="text-2xl lg:text-3xl font-black text-[#073933] leading-tight mb-6">
                  {project.name}
                </h3>

                <div className="flex items-center gap-8 lg:gap-10">
                  <div className="flex items-center gap-2.5 text-slate-400 font-medium text-sm lg:text-base">
                    <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
                    <span>Created {project.createdAtLabel}</span>
                  </div>

                  <div className="flex items-center gap-2 font-bold text-sm lg:text-base">
                    <PriorityIcon className={`w-5 h-5 lg:w-6 lg:h-6 ${p.color}`} />
                    <span className={p.color}>{p.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VERTICAL DIVIDER */}
          <div className="hidden md:block w-px bg-slate-100 self-stretch my-8" />

          {/* RIGHT SECTION */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
            <h4 className="text-xl lg:text-2xl font-medium text-[#073933] mb-8">Project Data</h4>

            <div className="flex items-start justify-between gap-4 lg:gap-6">
              <div className="flex-1">
                <p className="text-sm lg:text-base font-medium text-slate-400 mb-2 whitespace-nowrap">All tasks</p>
                <p className="text-2xl lg:text-3xl font-black text-[#073933]">
                  {project.allTasks}
                </p>
              </div>

              <div className="flex-1">
                <p className="text-sm lg:text-base font-medium text-slate-400 mb-2 whitespace-nowrap">Active Tasks</p>
                <p className="text-2xl lg:text-3xl font-black text-[#073933]">
                  {project.activeTasks}
                </p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-sm lg:text-base font-medium text-slate-400 mb-3">Assignees</p>

                <div className="flex items-center">
                  {visibleAssignees.map((a, idx) => (
                    <div
                      key={a.id}
                      className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white shadow-sm overflow-hidden"
                      style={{ marginLeft: idx === 0 ? 0 : -10, zIndex: 10 - idx }}
                      title={a.name}
                    >
                      {a.avatarUrl ? (
                        <Image src={a.avatarUrl} alt={a.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] lg:text-xs font-bold text-slate-500 uppercase">
                          {initials(a.name)}
                        </div>
                      )}
                    </div>
                  ))}

                  {extra > 0 && (
                    <div
                      className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-[#4293f5] text-white border-2 border-white shadow-sm flex items-center justify-center text-[10px] lg:text-xs font-bold"
                      style={{ marginLeft: -10, zIndex: 0 }}
                      title={`${extra} more`}
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
          className="text-[12px] sm:text-[11px] font-semibold hover:text-teal-800 flex items-center gap-1 mt-2"
        >
          View details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }
}
