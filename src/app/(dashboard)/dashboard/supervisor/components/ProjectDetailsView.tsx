'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import CreateTaskDialog from './CreateTaskDialog'

interface Task {
  id: number
  project_id: number
  task_number: string
  title: string
  description?: string
  deadline?: string
  status?: string
  assigned_to?: number
  assigned_to_name?: string
  created_by?: number
  created_by_name?: string
}

interface Project {
  id: number
  name: string
  description?: string
  priority?: string
  team_members?: any[]
  tasks?: Task[]
}

interface ProjectDetailsViewProps {
  project: Project
  onProjectUpdate: () => void
}

export default function ProjectDetailsView({
  project,
  onProjectUpdate,
}: ProjectDetailsViewProps) {
  const [tasks, setTasks] = useState<Task[]>(project.tasks || [])
  const [loading, setLoading] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    setTasks(project.tasks || [])
  }, [project])

  const fetchProjectTasks = async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/projects/${project.id}`, {
        method: 'GET',
      })
      const result = await response.json()
      if (result.success && result.data.tasks) {
        setTasks(result.data.tasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (formData: {
    title: string
    description?: string
    deadline?: string
    assigned_to?: number
  }) => {
    try {
      const response = await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          project_id: project.id,
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
          assigned_to: formData.assigned_to,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setTasks([...tasks, result.data])
        setIsCreateTaskOpen(false)
        onProjectUpdate()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await apiFetch(`/tasks/${taskId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        setTasks(tasks.filter((t) => t.id !== taskId))
        onProjectUpdate()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      const response = await apiFetch(`/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()
      if (result.success) {
        setTasks(
          tasks.map((t) =>
            t.id === task.id ? { ...t, status: newStatus } : t
          )
        )
        onProjectUpdate()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Project Info */}
        <div className="border-b border-gray-100 p-4 sm:p-6">
          <h3 className="mb-2 text-sm text-gray-500">Project Priority</h3>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                project.priority === 'high'
                  ? 'bg-red-100 text-red-700'
                  : project.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {project.priority || 'Medium'}
            </span>
          </div>

          {project.team_members && project.team_members.length > 0 && (
            <>
              <h3 className="mb-2 mt-4 text-sm text-gray-500">Team Members</h3>
              <div className="flex flex-wrap gap-2">
                {project.team_members.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-medium text-[#1a472a]"
                  >
                    {member.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tasks List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Tasks ({tasks.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateTaskOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#073933] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-500">No tasks yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 hover:bg-gray-100 transition"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTaskStatus(task)}
                    className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-[#073933]"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        task.status === 'completed'
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {task.assigned_to_name && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Assigned to {task.assigned_to_name}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-shrink-0 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        teamMembers={project.team_members || []}
      />
    </>
  )
}
