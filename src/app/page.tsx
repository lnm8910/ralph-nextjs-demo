'use client'

import { useEffect, useState } from 'react'
import { NoteCard } from '@/components/NoteCard'
import type { Note } from '@/db/schema'

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

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
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !note.pinned }),
      })
      fetchNotes()
    } catch (error) {
      console.error('Failed to pin note:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-gray-500 text-center">Loading notes...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {notes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No notes yet</p>
            <p className="text-gray-400 text-sm mt-2">Create your first note to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={handlePin}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
