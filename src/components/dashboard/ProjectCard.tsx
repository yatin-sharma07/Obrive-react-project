'use client'

import { CalendarDays, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'

export type ProjectPriority = 'Low' | 'Medium' | 'High'
type ProjectCardVariant = 'dashboard' | 'projects'
export interface ProjectAssignee {
  id: string
  name: string
  avatarUrl?: string
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

export default function ProjectCard({ project ,variant}: { project: ProjectItem; variant: ProjectCardVariant }) {
  const p = priorityUI(project.priority)
  const PriorityIcon = p.icon

  const visibleAssignees = project.assignees.slice(0, 3)
  const extra =
    (project.extraAssigneesCount ?? 0) +
    Math.max(0, project.assignees.length - visibleAssignees.length)

 
    if(variant==='dashboard'){
       return (
      <div className="bg-white rounded-lg border border-[#e8f0fb] shadow-sm overflow-hidden">
      <div className="flex">
        <div className="w-1/3 p-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eef7ff] border border-[#d9ecff] flex-shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-gray-400">{project.code}</p>
              <p className="text-xs font-bold text-[#1a472a] leading-snug line-clamp-2">
                {project.name}
              </p>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[9px] text-gray-400 min-w-0">
                  <CalendarDays className="w-3 h-3" />
                  <span className="truncate">{project.createdAtLabel}</span>
                </div>

                <div className="flex items-center gap-1 text-[9px] font-semibold">
                  <PriorityIcon className={`w-3 h-3 ${p.color}`} />
                  <span className={p.color}>{p.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-px bg-[#eef4ff]" />

        <div className="flex-1 p-3">
          <p className="text-xs font-bold text-[#1a472a]">Project Data</p>

          <div className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[9px] text-gray-400">All tasks</p>
              <p className="mt-0.5 text-base font-bold text-[#1a472a]">
                {project.allTasks}
              </p>
            </div>

            <div>
              <p className="text-[9px] text-gray-400">Active</p>
              <p className="mt-0.5 text-base font-bold text-[#1a472a]">
                {project.activeTasks}
              </p>
            </div>

            <div>
              <p className="text-[9px] text-gray-400">Assignees</p>

              <div className="mt-1 flex items-center">
                {visibleAssignees.map((a, idx) => (
                  <div
                    key={a.id}
                    className="w-5 h-5 rounded-full bg-[#eef7ff] border border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-gray-600"
                    style={{ marginLeft: idx === 0 ? 0 : -4 }}
                    title={a.name}
                  >
                    {initials(a.name)}
                  </div>
                ))}

                {extra > 0 && (
                  <div
                    className="w-5 h-5 rounded-full bg-blue-500 text-white border border-white shadow-sm flex items-center justify-center text-[8px] font-bold"
                    style={{ marginLeft: visibleAssignees.length === 0 ? 0 : -4 }}
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
    </div>)
    }
  if (variant === 'projects') {
  return (
    <div className=" rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-400">{project.code}</p>
        <p className="text-sm font-bold text-[#1a472a]">
          {project.name}
        </p>
      </div>

      <button className="text-sm font-semibold text-teal-700 flex items-center gap-1">
        View details <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
}