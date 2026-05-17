'use client'

import Image from 'next/image'
import supportImg from '@/assets/images/employee/illustration.png'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { User, Check } from 'lucide-react'

interface Employee {
  id: number
  name: string
  email: string
}

interface Client {
  id: number
  userid: string // This is the string identifier you want to save
  name: string
  email: string
  status: string
}

interface CreateProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    project_id: string
    description?: string
    priority?: string
    deadline?: string
    team_members: number[]
    client_id?: string // 1. CHANGED FROM number TO string
    status?: string
  }) => void
  creating?: boolean
  project?: any
  isEdit?: boolean
}

export default function CreateProjectDialog({
  open,
  onClose,
  onSubmit,
  creating,
  project,
  isEdit,
}: CreateProjectDialogProps) {
  const [name, setName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('medium')
  const [deadline, setDeadline] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string | null>(null) // 2. CHANGED FROM number TO string

  useEffect(() => {
    if (open) {
      fetchEmployees()
      fetchClients()

      if (isEdit && project) {
        setName(project.name || '')
        setDescription(project.description || '')
        setPriority(project.priority || 'medium')
        setDeadline(project.deadline ? project.deadline.split('T')[0] : '')
        setStatus(project.project_status || project.status || '')
        setProjectId(project.project_id || `PRJ-${Date.now().toString().slice(-6)}`)
        setSelectedEmployees(project.team_members ? project.team_members.map((m: any) => m.id) : [])
        setSelectedClient(project.client_id || null)
      } else {
        setProjectId(`PRJ-${Date.now().toString().slice(-6)}`)
        setName('')
        setDescription('')
        setPriority('medium')
        setDeadline('')
        setStatus('')
        setSelectedEmployees([])
        setSelectedClient(null)
      }
    }
  }, [open, isEdit, project])

  const fetchEmployees = async () => {
    try {
      const response = await apiFetch('/supervisor/employees', { method: 'GET' })
      const result = await response.json()
      if (result.success) {
        setEmployees(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await apiFetch('/projects/clients/list', { method: 'GET' })
      const result = await response.json() 
      if (result.success) {
        setClients(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const toggleEmployee = (id: number) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !projectId.trim()) return

    onSubmit({
      name: name.trim(),
      project_id: projectId.trim(),
      description: description.trim() || undefined,
      status: status.trim() || undefined, // 6. Added status to the submitted data
      priority,
      deadline: deadline || undefined,
      team_members: selectedEmployees,
      client_id: selectedClient || undefined, // 3. Submits the selected string directly
    })

    setName('')
    setProjectId('')
    setStatus('') // 7. Reset status field
    setDescription('')
    setPriority('medium')
    setDeadline('')
    setSelectedEmployees([])
    setSelectedClient(null)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
        >
          ×
        </button>

        <h2 className="mb-4 text-center text-xl font-semibold text-[#073933]">
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="projectId" className="mb-1 block text-sm text-gray-500">
                Project ID *
              </label>
              <input
                id="projectId"
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="PRJ-001"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm text-gray-500">
                Project Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm text-gray-500"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className="h-20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933] resize-none"
            />
          </div>


          <div>
            <label
              htmlFor="Status"
              className="mb-1 block text-sm text-gray-500"
            >
              Status
            </label>
            <textarea
              id="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Enter project status"
              className="h-20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="mb-1 block text-sm text-gray-500">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="deadline" className="mb-1 block text-sm text-gray-500">
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="client" className="mb-1 block text-sm text-gray-500">
              Select Client (Optional)
            </label>
            <select
              id="client"
              value={selectedClient || ''}
              // 4. CHANGED: Simply set the string value without parsing it into a Number
              onChange={(e) => setSelectedClient(e.target.value || null)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
            >
              <option value="">-- No Client --</option>
              {clients.length === 0 ? (
                <option disabled>No clients available</option>
              ) : (
                clients.map(client => (
                  // 5. CHANGED: Replaced value={client.id} with value={client.userid}
                  <option key={client.id} value={client.userid}>
                    {client.name} ({client.userid})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-500">
              Assign Team Members ({selectedEmployees.length} selected)
            </label>
            <div className="max-h-40 overflow-y-auto rounded-lg border p-2 space-y-1">
              {employees.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">No employees available</p>
              ) : (
                employees.map(employee => (
                  <div 
                    key={employee.id}
                    onClick={() => toggleEmployee(employee.id)}
                    className={`flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer transition ${
                      selectedEmployees.includes(employee.id) ? 'bg-[#eef7ff]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{employee.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{employee.email}</p>
                      </div>
                    </div>
                    {selectedEmployees.includes(employee.id) && (
                      <Check className="h-4 w-4 text-[#073933] flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={creating || !name.trim() || !projectId.trim()}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Project' : 'Create Project')}
          </button>
        </form>
      </div>
    </div>
  )
}