'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle, Circle, UserPlus, Edit, Crown, BarChart2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import CreateTaskDialog from './CreateTaskDialog'
import EditTaskDialog from './EditTaskDialog'
import AssignEmployeesDialog from './AssignEmployeesDialog'
import ConfirmationAlert from '@/components/ConfirmationAlert'

interface Task {
  id: number
  project_id?: number
  task_number?: string
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
  project_id?: string
  description?: string
  priority?: string
  deadline?: string
  progress?: number
  leader_id?: number
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
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
  const [isAssignEmployeesOpen, setIsAssignEmployeesOpen] = useState(false)
  const [updatingProgress, setUpdatingProgress] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean
    title: string
    description: string
    type: 'success' | 'error' | 'info' | 'warning'
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info',
  })

  useEffect(() => {
    setTasks(project.tasks || [])
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
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

  const handleCreateTask = async (data: any) => {
    try {
      const response = await apiFetch(`/tasks/${project.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (result.success) {
        setAlertConfig({
          isOpen: true,
          title: 'Success',
          description: 'Task created successfully',
          type: 'success',
        })
        setTasks([result.data, ...tasks])
        setIsCreateTaskOpen(false)
        onProjectUpdate()
      }
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Error',
        description: error.message || 'Failed to create task',
        type: 'error',
      })
    }
  }

  const handleEditTask = async (data: any) => {
    if (!taskToEdit) return
    try {
      const response = await apiFetch(`/tasks/${taskToEdit.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (result.success) {
        setAlertConfig({
          isOpen: true,
          title: 'Success',
          description: 'Task updated successfully',
          type: 'success',
        })
        setTasks(tasks.map((t) => (t.id === taskToEdit.id ? result.data : t)))
        setIsEditTaskOpen(false)
        setTaskToEdit(null)
        onProjectUpdate()
      }
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Error',
        description: error.message || 'Failed to update task',
        type: 'error',
      })
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Delete Task',
      description: 'Are you sure you want to delete this task? This action cannot be undone.',
      type: 'error',
      onConfirm: async () => {
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
        } finally {
          setAlertConfig(prev => ({ ...prev, isOpen: false }))
        }
      }
    })
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
        setAlertConfig({
          isOpen: true,
          title: 'Success',
          description: `Task marked as ${newStatus}`,
          type: 'success',
        })
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

  const handleAssignLeader = async (leaderId: number) => {
    try {
      const response = await apiFetch(`/projects/${project.id}/leader`, {
        method: 'PUT',
        body: JSON.stringify({ leaderId }),
      })
      const result = await response.json()
      if (result.success) {
        setAlertConfig({
          isOpen: true,
          title: 'Success',
          description: 'Project leader assigned successfully',
          type: 'success',
        })
        onProjectUpdate()
      }
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Error',
        description: error.message || 'Failed to assign leader',
        type: 'error',
      })
    }
  }

  const handleUpdateProgress = async (progress: number) => {
    try {
      setUpdatingProgress(true)
      const response = await apiFetch(`/projects/${project.id}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ progress }),
      })
      const result = await response.json()
      if (result.success) {
        onProjectUpdate()
      }
    } catch (error: any) {
      console.error('Error updating progress:', error)
    } finally {
      setUpdatingProgress(false)
    }
  }

  const getTaskStatusStyle = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'in-progress':
        return 'bg-sky-100 text-sky-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleAssignEmployees = async (employeeIds: number[]) => {
    try {
      setLoading(true)
      // Assign new employees
      for (const employeeId of employeeIds) {
        if (!project.team_members?.some(member => member.id === employeeId)) {
          await apiFetch(`/projects/${project.id}/assign`, {
            method: 'POST',
            body: JSON.stringify({ employeeId }),
          })
        }
      }
      
      setAlertConfig({
        isOpen: true,
        title: 'Success',
        description: 'Employees assigned successfully',
        type: 'success',
      })
      
      onProjectUpdate()
      setIsAssignEmployeesOpen(false)
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Error',
        description: error.message || 'Failed to assign employees',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveEmployee = async (employeeId: number) => {
    setAlertConfig({
      isOpen: true,
      title: 'Remove Member',
      description:
        'Are you sure you want to remove this employee from the project?',
      type: 'warning',
      onConfirm: async () => {
        try {
          const response = await apiFetch(
            `/projects/${project.id}/assign/${employeeId}`,
            {
              method: 'DELETE',
            }
          )

          const result = await response.json()
          if (result.success) {
            onProjectUpdate()
          }
        } catch (error) {
          console.error('Error removing employee:', error)
        } finally {
          setAlertConfig((prev) => ({ ...prev, isOpen: false }))
        }
      },
    })
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

          {project.deadline && (
            <div className="mt-2 text-xs text-gray-500">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">Progress</span>
              <span className="text-xs font-bold text-[#073933]">{project.progress || 0}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#073933] transition-all duration-500" 
                style={{ width: `${project.progress || 0}%` }}
              ></div>
            </div>
            {(currentUser?.role === 'supervisor' || currentUser?.role === 'hr' || (project.leader_id && currentUser?.id && Number(project.leader_id) === Number(currentUser.id))) && (
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={project.progress || 0}
                onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
                className="w-full mt-2 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#073933]"
              />
            )}
          </div>

          {project.team_members && project.team_members.length > 0 && (
            <>
              <h3 className="mb-2 mt-6 text-sm text-gray-500">Team Members</h3>
              <div className="flex flex-wrap gap-2">
                {project.team_members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition ${
                      project.leader_id === member.id 
                        ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-200' 
                        : 'bg-[#eef7ff] text-[#1a472a]'
                    }`}
                  >
                    {project.leader_id === member.id && <Crown className="h-3 w-3" />}
                    {member.name}
                    <div className="flex items-center gap-1 ml-1 border-l border-black/10 pl-1">
                      {(currentUser?.role === 'supervisor' || currentUser?.role === 'hr') && project.leader_id !== member.id && (
                        <button
                          onClick={() => handleAssignLeader(member.id)}
                          className="text-amber-600 hover:text-amber-700"
                          title="Make Leader"
                        >
                          <Crown className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveEmployee(member.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Member"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsAssignEmployeesOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#073933] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
            >
              <UserPlus className="h-4 w-4" />
              Assign Employees
            </button>
          </div>
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getTaskStatusStyle(task.status)}`}>
                        {task.status || 'pending'}
                      </span>
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

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTaskToEdit(task)
                        setIsEditTaskOpen(true)
                      }}
                      className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-blue-600 transition"
                      title="Edit task"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-red-600 transition"
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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

      {/* Edit Task Dialog */}
      <EditTaskDialog
        open={isEditTaskOpen}
        onClose={() => {
          setIsEditTaskOpen(false)
          setTaskToEdit(null)
        }}
        task={taskToEdit}
        onSubmit={handleEditTask}
        teamMembers={project.team_members || []}
      />

      {/* Assign Employees Dialog */}
      <AssignEmployeesDialog
        open={isAssignEmployeesOpen}
        onClose={() => setIsAssignEmployeesOpen(false)}
        project={project}
        onAssign={handleAssignEmployees}
      />

      <ConfirmationAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        description={alertConfig.description}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  )
}
