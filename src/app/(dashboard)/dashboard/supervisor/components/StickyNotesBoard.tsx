'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface StickyNote {
  id: number
  user_id: number
  content?: string
  color?: string
  note_date: string
  position: number
}

interface StickyNotesBoardProps {
  notes: StickyNote[]
  onDeleteNote: (noteId: number) => void
}

const colors: Record<string, { bg: string; text: string; border: string }> = {
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-900',
    border: 'border-yellow-300',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-900',
    border: 'border-pink-300',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-900',
    border: 'border-blue-300',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-900',
    border: 'border-green-300',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-900',
    border: 'border-purple-300',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-900',
    border: 'border-orange-300',
  },
}

export default function StickyNotesBoard({
  notes,
  onDeleteNote,
}: StickyNotesBoardProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">No notes for this date. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note, index) => {
          const colorScheme = colors[note.color || 'yellow']

          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative rounded-lg border-2 p-4 shadow-md transition hover:shadow-lg ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text}`}
              style={{
                minHeight: '160px',
                transform: `rotate(${(index % 3 - 1) * 2}deg)`,
              }}
            >
              <button
                type="button"
                onClick={() => onDeleteNote(note.id)}
                className="absolute right-2 top-2 rounded-full p-1 opacity-0 transition hover:bg-black/10 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="whitespace-pre-wrap text-sm leading-relaxed pr-6">
                {note.content}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
