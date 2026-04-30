'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import SkeletonLoading from '@/components/SkelitonLoading'
import StickyNotesBoard from '../components/StickyNotesBoard'
import CreateNoteDialog from '../components/CreateNoteDialog'

interface StickyNote {
  id: number
  user_id: number
  content?: string
  color?: string
  note_date: string
  position: number
  created_at?: string
  updated_at?: string
}

export default function StickyNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    fetchNotes()
  }, [selectedDate])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/sticky-notes?date=${selectedDate}`, {
        method: 'GET',
      })
      const result = await response.json()
      if (result.success) {
        setNotes(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (content: string, color: string) => {
    try {
      const response = await apiFetch('/sticky-notes', {
        method: 'POST',
        body: JSON.stringify({
          content,
          color,
          note_date: selectedDate,
          position: notes.length,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setNotes([...notes, result.data])
        setIsCreateOpen(false)
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    try {
      const response = await apiFetch(`/sticky-notes/${noteId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      if (result.success) {
        setNotes(notes.filter((note) => note.id !== noteId))
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  if (loading) {
    return <SkeletonLoading />
  }

  return (
    <motion.div
      className="flex h-full min-h-0 flex-col gap-4 p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#073933] sm:text-2xl">
            Sticky Notes
          </h1>
          <p className="text-sm text-gray-600">
            Manage your task notes for {new Date(selectedDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#073933]"
          />
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#073933] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a4a42]"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </button>
        </div>
      </div>

      {/* Notes Board */}
      <StickyNotesBoard notes={notes} onDeleteNote={handleDeleteNote} />

      {/* Create Note Dialog */}
      <CreateNoteDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateNote}
      />
    </motion.div>
  )
}
