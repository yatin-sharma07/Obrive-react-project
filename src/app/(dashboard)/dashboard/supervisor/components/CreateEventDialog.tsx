'use client'

import { useState } from 'react'

interface CreateEventDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  creating: boolean
}

export default function CreateEventDialog({
  open,
  onClose,
  onSubmit,
  creating,
}: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'meeting',
    priority: 'medium',
    eventDate: new Date().toISOString().split('T')[0],
    eventTime: '10:00',
    endTime: '11:00',
    location: '',
    eventType: 'internal',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.eventDate) return
    onSubmit(formData)
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
          Add Nearest Event
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm text-gray-500">Event Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Project Review"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Date *</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Time *</label>
              <input
                type="time"
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              >
                <option value="meeting">Meeting</option>
                <option value="workshop">Workshop</option>
                <option value="deadline">Deadline</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-500">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Conference Room A"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
            />
          </div>

          <button
            type="submit"
            disabled={creating || !formData.title.trim()}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Adding...' : 'Add Event'}
          </button>
        </form>
      </div>
    </div>
  )
}
