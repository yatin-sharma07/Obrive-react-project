'use client'

import { useState } from 'react'

const colors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange']
const colorNames: Record<string, string> = {
  yellow: 'Yellow',
  pink: 'Pink',
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
  orange: 'Orange',
}

interface CreateNoteDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (content: string, color: string) => void
}

export default function CreateNoteDialog({
  open,
  onClose,
  onSubmit,
}: CreateNoteDialogProps) {
  const [content, setContent] = useState('')
  const [selectedColor, setSelectedColor] = useState('yellow')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      setSubmitting(true)
      await onSubmit(content.trim(), selectedColor)
      setContent('')
      setSelectedColor('yellow')
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg hover:bg-gray-200"
        >
          ×
        </button>

        <h2 className="mb-4 text-center text-xl font-semibold text-[#073933]">
          Create New Note
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="content" className="mb-2 block text-sm text-gray-500">
              Note Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="h-32 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#073933]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Note Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  title={colorNames[color]}
                  className={`h-10 rounded-lg border-2 transition ${
                    selectedColor === color
                      ? 'border-gray-800 scale-105'
                      : 'border-gray-200'
                  } ${
                    color === 'yellow'
                      ? 'bg-yellow-100'
                      : color === 'pink'
                        ? 'bg-pink-100'
                        : color === 'blue'
                          ? 'bg-blue-100'
                          : color === 'green'
                            ? 'bg-green-100'
                            : color === 'purple'
                              ? 'bg-purple-100'
                              : 'bg-orange-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="w-full rounded-xl bg-[#073933] py-3 font-medium text-white transition hover:bg-[#0a4a42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create Note'}
          </button>
        </form>
      </div>
    </div>
  )
}
