'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { NoteWithChecklist } from '@/components/NoteCard'
import type { ChecklistItem } from '@/db/schema'

const colorClasses: Record<string, string> = {
  yellow: 'bg-amber-100',
  green: 'bg-emerald-100',
  blue: 'bg-blue-100',
  pink: 'bg-pink-100',
  purple: 'bg-violet-100',
  gray: 'bg-gray-100',
}

export default function ArchivePage() {
  const [notes, setNotes] = useState<NoteWithChecklist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArchivedNotes()
  }, [])

  async function fetchArchivedNotes() {
    try {
      const response = await fetch('/api/notes/archived')
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Failed to fetch archived notes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUnarchive(note: NoteWithChecklist) {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: false }),
      })
      fetchArchivedNotes()
    } catch (error) {
      console.error('Failed to unarchive note:', error)
    }
  }

  async function handleDelete(note: NoteWithChecklist) {
    const confirmed = window.confirm('Are you sure you want to delete this note?')
    if (!confirmed) {
      return
    }

    try {
      await fetch(`/api/notes/${note.id}`, {
        method: 'DELETE',
      })
      fetchArchivedNotes()
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back to notes"
            >
              <BackArrowIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Archive</h1>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-gray-500 text-center">Loading archived notes...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to notes"
          >
            <BackArrowIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Archive</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {notes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No archived notes</p>
            <p className="text-gray-400 text-sm mt-2">Notes you archive will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <ArchivedNoteCard
                key={note.id}
                note={note}
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface ArchivedNoteCardProps {
  note: NoteWithChecklist
  onUnarchive: (note: NoteWithChecklist) => void
  onDelete: (note: NoteWithChecklist) => void
}

function ArchivedNoteCard({ note, onUnarchive, onDelete }: ArchivedNoteCardProps) {
  const bgColor = colorClasses[note.color] || colorClasses.yellow

  return (
    <div
      className={`group relative rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200/80 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] ${bgColor}`}
    >
      {/* Title */}
      {note.title && (
        <h3 className="font-medium text-gray-900 mb-2">{note.title}</h3>
      )}

      {/* Content - Checklist or regular text */}
      {note.isChecklist && note.checklistItems && note.checklistItems.length > 0 ? (
        <ChecklistDisplay items={note.checklistItems} />
      ) : note.content ? (
        <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.content}</p>
      ) : null}

      {/* Action buttons - visible on hover */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onUnarchive(note)}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors duration-150"
          title="Unarchive"
          aria-label="Unarchive note"
        >
          <UnarchiveIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(note)}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors duration-150"
          title="Delete"
          aria-label="Delete note"
        >
          <DeleteIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

// Checklist display component
const MAX_VISIBLE_ITEMS = 5

function ChecklistDisplay({ items }: { items: ChecklistItem[] }) {
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS)
  const hiddenCount = items.length - MAX_VISIBLE_ITEMS

  return (
    <div className="space-y-1">
      {visibleItems.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-sm">
          <CheckboxIcon checked={item.checked} className="h-4 w-4 flex-shrink-0" />
          <span className={item.checked ? 'text-gray-500 line-through' : 'text-gray-700'}>
            {item.text}
          </span>
        </div>
      ))}
      {hiddenCount > 0 && (
        <p className="text-xs text-gray-500 mt-1">+ {hiddenCount} more</p>
      )}
    </div>
  )
}

function CheckboxIcon({ checked, className }: { checked: boolean; className?: string }) {
  if (checked) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}

// Icon components
function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function UnarchiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8v13H3V8M1 3h22v5H1V3zM12 11v6M9 14l3-3 3 3" />
    </svg>
  )
}

function DeleteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" />
    </svg>
  )
}
