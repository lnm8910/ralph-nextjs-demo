'use client'

import { useEffect, useState, useMemo } from 'react'
import { NoteCard } from '@/components/NoteCard'
import { CreateNoteForm } from '@/components/CreateNoteForm'
import { EditNoteModal } from '@/components/EditNoteModal'
import type { Note } from '@/db/schema'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredNotes = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return notes
    }
    const query = debouncedSearchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        (note.content && note.content.toLowerCase().includes(query))
    )
  }, [notes, debouncedSearchQuery])

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    try {
      const response = await fetch('/api/notes')
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePin(note: Note) {
    const newPinnedState = !note.pinned

    // Optimistic update: immediately update the UI
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((n) =>
        n.id === note.id ? { ...n, pinned: newPinnedState } : n
      )
      // Re-sort: pinned notes first, then by createdAt desc
      return updatedNotes.sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1
        }
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    })

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: newPinnedState }),
      })
      if (!response.ok) {
        // Revert on failure
        fetchNotes()
      }
    } catch (error) {
      console.error('Failed to pin note:', error)
      // Revert on error
      fetchNotes()
    }
  }

  async function handleArchive(note: Note) {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
      })
      fetchNotes()
    } catch (error) {
      console.error('Failed to archive note:', error)
    }
  }

  async function handleDelete(note: Note) {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      })
      fetchNotes()
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  function handleNoteClick(note: Note) {
    setEditingNote(note)
  }

  function handleModalClose() {
    setEditingNote(null)
  }

  function handleNoteSaved() {
    fetchNotes()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-gray-500 text-center">Loading notes...</p>
        </main>
      </div>
    )
  }

  const hasSearchQuery = debouncedSearchQuery.trim().length > 0

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <CreateNoteForm onNoteCreated={fetchNotes} />
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No notes yet</p>
            <p className="text-gray-400 text-sm mt-2">Create your first note to get started</p>
          </div>
        ) : filteredNotes.length === 0 && hasSearchQuery ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No matching notes</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={handlePin}
                onArchive={handleArchive}
                onDelete={handleDelete}
                onClick={handleNoteClick}
              />
            ))}
          </div>
        )}

        <EditNoteModal
          note={editingNote}
          onClose={handleModalClose}
          onSave={handleNoteSaved}
        />
      </main>
    </div>
  )
}
