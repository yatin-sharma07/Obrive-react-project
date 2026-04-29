'use client'

import Image from 'next/image'
import supportImg from '@/assets/images/employee/illustration.png'
import { useState } from 'react'

interface CreateTaskDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    deadline?: string
    assigned_to?: number
  }) => void
  teamMembers: any[]
}

export default function CreateTaskDialog({
  open,
  onClose,
  onSubmit,
  teamMembers,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setCreating(true)
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        assigned_to: assignedTo ? Number(assignedTo) : undefined,
      })

      setTitle('')
      setDescription('')
      setDeadline('')
      setAssignedTo('')
    } finally {
      setCreating(false)
    }
  }

  if (!open) return null

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
          Create New Task
        </h2>

        <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={supportImg}
            alt="create task"
            className="h-full w-auto object-contain"
          />
        </div>

        <p className="mb-5 text-center text-sm text-gray-600">
          Add a new task and assign it to a team member.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="mb-1 block text-sm text-gray-500">
              Task Title *
            </label>
            <input
              id="title"
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
              htmlFor="description"
              className="mb-1 block text-sm text-gray-500"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="h-20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label htmlFor="assigned" className="mb-1 block text-sm text-gray-500">
                Assign To
              </label>
              <select
                id="assigned"
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

          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
