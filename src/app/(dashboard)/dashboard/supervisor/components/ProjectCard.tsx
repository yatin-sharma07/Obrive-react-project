'use client'

import { FolderOpen, Users, Calendar } from 'lucide-react'

interface ProjectCardProps {
  id: number
  name: string
  description?: string
  priority?: string
  team_members?: any[]
  tasks?: any[]
  created_at?: string
  onSelect?: () => void
}

export default function ProjectCard({
  name,
  description,
  priority = 'medium',
  team_members = [],
  tasks = [],
  created_at,
  onSelect,
}: ProjectCardProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div
      onClick={onSelect}
      className="rounded-xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer transition-all
                   bg-white border border-transparent
                   hover:border-r-4 hover:border-r-teal-600 hover:bg-[#eef4f8]"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <FolderOpen className="h-5 w-5 text-[#1a472a] flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          </div>
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wider flex-shrink-0 ${getPriorityColor(
              priority
            )}`}
          >
            {priority}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{team_members.length} members</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              {completedTasks}/{tasks.length} tasks
            </span>
          </div>
        </div>

        {created_at && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
