'use client'

import { ChevronRight } from 'lucide-react'
import ProjectCard, { type ProjectItem } from '@/components/dashboard/ProjectCard'

interface ProjectsProps {
  projects?: ProjectItem[]
  onViewAll?: () => void
}

const defaultProjects: ProjectItem[] = [
  {
    id: 'p1',
    code: 'PN0001265',
    name: 'Medical App [iOS native]',
    createdAtLabel: 'Created Sep 12, 2020',
    priority: 'Medium',
    allTasks: 34,
    activeTasks: 13,
    assignees: [
      { id: 'a1', name: 'Shawn Stone' },
      { id: 'a2', name: 'Emily Tyler' },
      { id: 'a3', name: 'Louis Castro' },
    ],
    extraAssigneesCount: 2,
  },
  {
    id: 'p2',
    code: 'PN0001221',
    name: 'Food Delivery Service',
    createdAtLabel: 'Created Sep 10, 2020',
    priority: 'Medium',
    allTasks: 50,
    activeTasks: 24,
    assignees: [
      { id: 'b1', name: 'Randy Delgado' },
      { id: 'b2', name: 'Joel Phillips' },
      { id: 'b3', name: 'Wayne Marsh' },
    ],
  },
  {
    id: 'p3',
    code: 'PN0001290',
    name: 'Food Delivery Service',
    createdAtLabel: 'Created May 28, 2020',
    priority: 'Low',
    allTasks: 23,
    activeTasks: 20,
    assignees: [
      { id: 'c1', name: 'Oscar Holloway' },
      { id: 'c2', name: 'Emily Tyler' },
      { id: 'c3', name: 'Shawn Stone' },
    ],
    extraAssigneesCount: 5,
  },
]

export default function Projects({ projects = defaultProjects, onViewAll }: ProjectsProps) {
  return (
    <section className="bg-transparent">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-extrabold text-[#1a472a]">Projects</h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}