'use client'

import { useState, useEffect, useRef } from 'react'
import type { NoteWithChecklist } from '@/components/NoteCard'
import type { ChecklistItem } from '@/db/schema'

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
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [newItemText, setNewItemText] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content || '')
      setColor(note.color)
      setChecklistItems(note.checklistItems || [])
      setNewItemText('')
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

  function toggleChecklistItem(id: string) {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  function updateChecklistItemText(id: string, text: string) {
    setChecklistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    )
  }

  function deleteChecklistItem(id: string) {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id))
  }

  function addChecklistItem() {
    if (!newItemText.trim()) return

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      checked: false,
    }
    setChecklistItems((prev) => [...prev, newItem])
    setNewItemText('')
  }

  function handleNewItemKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addChecklistItem()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note) return

    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        color,
      }

      if (note.isChecklist) {
        body.checklistItems = checklistItems
      } else {
        body.content = content.trim()
      }

      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
          {note?.isChecklist ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Existing checklist items */}
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button
                    type="button"
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex-shrink-0"
                    aria-label={item.checked ? 'Uncheck item' : 'Check item'}
                  >
                    {item.checked ? (
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="w-5 h-5 border-2 border-gray-400 rounded-full block" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateChecklistItemText(item.id, e.target.value)}
                    className={`flex-1 bg-transparent border-none outline-none text-gray-700 ${
                      item.checked ? 'line-through text-gray-400' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => deleteChecklistItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity duration-150 flex-shrink-0"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Input for new item */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Add item..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={handleNewItemKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={addChecklistItem}
                  disabled={!newItemText.trim()}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors duration-150 flex-shrink-0"
                  title="Add item"
                  aria-label="Add item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <textarea
              placeholder="Note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500"
            />
          )}
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
