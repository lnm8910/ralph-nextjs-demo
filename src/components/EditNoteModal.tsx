'use client'

import { useState, useEffect, useRef } from 'react'
import type { NoteWithChecklist } from '@/components/NoteCard'

const colors = [
  { name: 'yellow', class: 'bg-amber-100', ring: 'ring-amber-300' },
  { name: 'green', class: 'bg-emerald-100', ring: 'ring-emerald-300' },
  { name: 'blue', class: 'bg-blue-100', ring: 'ring-blue-300' },
  { name: 'pink', class: 'bg-pink-100', ring: 'ring-pink-300' },
  { name: 'purple', class: 'bg-violet-100', ring: 'ring-violet-300' },
  { name: 'gray', class: 'bg-gray-100', ring: 'ring-gray-300' },
]

interface EditNoteModalProps {
  note: NoteWithChecklist | null
  onClose: () => void
  onSave: (note: NoteWithChecklist) => void
}

export function EditNoteModal({ note, onClose, onSave }: EditNoteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('yellow')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || '')
      setColor(note.color)
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [note])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          color,
        }),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        onSave(updatedNote)
        onClose()
      }
    } catch (error) {
      console.error('Failed to update note:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedColorClass = colors.find(c => c.name === color)?.class || 'bg-amber-100'

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="backdrop:bg-black/50 bg-transparent p-4 m-auto rounded-lg max-w-xl w-[calc(100%-2rem)] sm:w-full"
    >
      <form
        onSubmit={handleSubmit}
        className={`rounded-lg shadow-xl overflow-hidden transition-colors duration-200 ${selectedColorClass}`}
      >
        <div className="p-3 sm:p-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-500 mb-2 text-base sm:text-lg"
          />
          <textarea
            placeholder="Note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500"
          />
        </div>

        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200/50">
          {/* Color picker */}
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${c.class} border border-gray-300 transition-all duration-150 ${
                  color === c.name ? `ring-2 ${c.ring}` : ''
                }`}
                title={c.name}
                aria-label={`Set color to ${c.name}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 text-sm text-gray-600 hover:bg-black/5 rounded transition-colors duration-150"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-3 sm:px-4 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors duration-150 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
