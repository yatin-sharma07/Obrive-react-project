'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowLeft, Menu, X, Trash2 } from 'lucide-react'
import SkeletonLoading from '@/components/SkelitonLoading'
import { apiFetch } from '@/lib/api'
import CreateProjectDialog from '../components/CreateProjectDialog'
import ProjectCard from '../components/ProjectCard'
import ProjectDetailsView from '../components/ProjectDetailsView'
import ConfirmationAlert from '@/components/ConfirmationAlert'

interface Project {
  id: number
  name: string
  description?: string
  priority?: string
  created_at?: string
  team_members?: any[]
  tasks?: any[]
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isProjectListOpen, setIsProjectListOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; projectId: number | null }>({
    isOpen: false,
    projectId: null,
  })

  // Fetch all supervisor projects
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/supervisor/projects', { method: 'GET' })
      const result = await response.json()
      if (result.success) {
        // Transform project_assignments to team_members
        const transformedProjects = result.data.map((project: any) => ({
          ...project,
          team_members: project.project_assignments?.map((pa: any) => pa.users) || []
        }))
        setProjects(transformedProjects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (formData: {
    name: string
    project_id: string
    description?: string
    priority?: string
    deadline?: string
    team_members: number[]
  }) => {
    try {
      setCreating(true)
      const response = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (result.success) {
        // Transform the new project to include team_members for the UI
        const newProject = {
          ...result.data,
          team_members: formData.team_members.map(id => {
            const emp = result.data.team_members?.find((m: any) => m.id === id)
            return emp || { id }
          })
        }
        setProjects([...projects, newProject])
        setIsCreateProjectOpen(false)
        fetchProjects() // Refetch to get full data with joined users
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    setDeleteAlert({ isOpen: true, projectId })
  }

  const confirmDeleteProject = async () => {
    const projectId = deleteAlert.projectId
    if (!projectId) return

    try {
      const response = await apiFetch(`/projects/${projectId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        setProjects(projects.filter((p) => p.id !== projectId))
        if (selectedProject?.id === projectId) {
          setSelectedProject(null)
        }
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setDeleteAlert({ isOpen: false, projectId: null })
    }
  }

  if (loading) {
    return <SkeletonLoading />
  }

  return (
    <motion.div
      className="h-full min-h-0 p-3 sm:p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Mobile header */}
      <div className="mb-3 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setIsProjectListOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          <Menu className="h-4 w-4" />
          Projects
        </button>
        <span className="text-sm font-semibold text-[#1a472a]">
          {selectedProject ? 'Project Details' : 'All Projects'}
        </span>
      </div>

      {isProjectListOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsProjectListOpen(false)}
        />
      ) : null}

      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden lg:flex-row">
        {/* Projects List */}
        <div
          className={`${
            isProjectListOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-3 left-3 z-50 w-[min(20rem,calc(100vw-1.5rem))] transition-transform lg:static lg:w-64 lg:translate-x-0 lg:flex-shrink-0`}
        >
          <div className="h-full overflow-y-auto rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 lg:hidden">
              <h2 className="text-sm font-semibold text-[#1a472a]">Projects</h2>
              <button
                type="button"
                onClick={() => setIsProjectListOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Create Project Button */}
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(true)}
              className="mb-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#073933] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>

            {/* Projects List */}
            <div className="space-y-2">
              {projects.length === 0 ? (
                <p className="text-center text-sm text-gray-500">No projects yet</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project)
                      setIsProjectListOpen(false)
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      selectedProject?.id === project.id
                        ? 'bg-[#1a472a] text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <p className="truncate">{project.name}</p>
                    {project.team_members && (
                      <p className="text-xs opacity-75">
                        {project.team_members.length} members
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          {selectedProject ? (
            <>
              <div className="flex items-center gap-3 rounded-2xl bg-[#eef7ff] p-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="rounded-lg p-2 hover:bg-white/50 lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-[#1a472a] truncate">
                    {selectedProject.name}
                  </h2>
                  {selectedProject.description && (
                    <p className="text-xs text-gray-600 truncate">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(selectedProject.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <ProjectDetailsView project={selectedProject} onProjectUpdate={fetchProjects} />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Select a project or create a new one</p>
                <button
                  type="button"
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#073933] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
                >
                  <Plus className="h-4 w-4" />
                  Create Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSubmit={handleCreateProject}
        creating={creating}
      />

      <ConfirmationAlert
        isOpen={deleteAlert.isOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        type="error"
        confirmLabel="Delete"
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteAlert({ isOpen: false, projectId: null })}
      />
    </motion.div>
  )
}

export default Projects
