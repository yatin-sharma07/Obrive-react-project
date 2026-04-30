'use client'

import { useState, useEffect } from 'react'

interface EditTaskDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    deadline?: string
    assigned_to?: number
    status?: string
  }) => void
  task: any
  teamMembers: any[]
}

export default function EditTaskDialog({
  open,
  onClose,
  onSubmit,
  task,
  teamMembers,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '')
      setAssignedTo(task.assigned_to?.toString() || '')
      setStatus(task.status || 'pending')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setUpdating(true)
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        assigned_to: assignedTo ? Number(assignedTo) : undefined,
        status: status || undefined,
      })
    } finally {
      setUpdating(false)
    }
  }

  if (!open || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
      <div className="relative w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
        >
          ×
        </button>

        <h2 className="mb-4 text-center text-xl font-semibold text-[#073933]">
          Edit Task
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="edit-title" className="mb-1 block text-sm text-gray-500">
              Task Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1 block text-sm text-gray-500"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="h-20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-deadline" className="mb-1 block text-sm text-gray-500">
                Deadline
              </label>
              <input
                id="edit-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              />
            </div>

            <div>
              <label htmlFor="edit-assigned" className="mb-1 block text-sm text-gray-500">
                Assign To
              </label>
              <select
                id="edit-assigned"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-status" className="mb-1 block text-sm text-gray-500">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updating || !title.trim()}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updating ? 'Updating...' : 'Update Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
