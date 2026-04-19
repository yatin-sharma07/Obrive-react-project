'use client'

import { ChevronRight } from 'lucide-react'
import ProjectCard, { type ProjectItem } from '@/components/dashboard/ProjectCard'

interface ProjectsProps {
  projects?: ProjectItem[]
  onViewAll?: () => void
}

export default function Projects({ projects = [], onViewAll }: ProjectsProps) {
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