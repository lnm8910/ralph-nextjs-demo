'use client'

import { useState } from 'react'
import type { ChecklistItem } from '@/db/schema'

const colors = [
  { name: 'yellow', class: 'bg-amber-100', ring: 'ring-amber-300' },
  { name: 'green', class: 'bg-emerald-100', ring: 'ring-emerald-300' },
  { name: 'blue', class: 'bg-blue-100', ring: 'ring-blue-300' },
  { name: 'pink', class: 'bg-pink-100', ring: 'ring-pink-300' },
  { name: 'purple', class: 'bg-violet-100', ring: 'ring-violet-300' },
  { name: 'gray', class: 'bg-gray-100', ring: 'ring-gray-300' },
]

interface CreateNoteFormProps {
  onNoteCreated: () => void
}

export function CreateNoteForm({ onNoteCreated }: CreateNoteFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('yellow')
  const [submitting, setSubmitting] = useState(false)
  const [isChecklist, setIsChecklist] = useState(false)
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])
  const [newItemText, setNewItemText] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // For checklist notes, check if there are items; for text notes, check title/content
    const hasContent = isChecklist
      ? checklistItems.length > 0 || title.trim()
      : title.trim() || content.trim()

    if (!hasContent) {
      setExpanded(false)
      return
    }

    setSubmitting(true)
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        color,
        isChecklist,
      }

      if (isChecklist) {
        body.checklistItems = checklistItems
      } else {
        body.content = content.trim()
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        setTitle('')
        setContent('')
        setColor('yellow')
        setIsChecklist(false)
        setChecklistItems([])
        setNewItemText('')
        setExpanded(false)
        onNoteCreated()
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    const hasContent = isChecklist
      ? checklistItems.length > 0 || title.trim()
      : title.trim() || content.trim()

    if (!hasContent) {
      setExpanded(false)
      setColor('yellow')
      setIsChecklist(false)
      setChecklistItems([])
      setNewItemText('')
    }
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

  function removeChecklistItem(id: string) {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleNewItemKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addChecklistItem()
    }
  }

  const selectedColorClass = colors.find(c => c.name === color)?.class || 'bg-amber-100'

  if (!expanded) {
    return (
      <div
        className="max-w-xl mx-auto mb-6 sm:mb-8"
        onClick={() => setExpanded(true)}
      >
        <div className="rounded-lg shadow border border-gray-200 p-3 sm:p-4 cursor-text bg-white hover:shadow-md transition-shadow duration-200">
          <span className="text-gray-500">Take a note...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mb-6 sm:mb-8">
      <form
        onSubmit={handleSubmit}
        className={`rounded-lg shadow-md border border-gray-200 overflow-hidden transition-colors duration-200 ${selectedColorClass}`}
      >
        <div className="p-3 sm:p-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-500 mb-2"
            autoFocus
          />
          {isChecklist ? (
            <div className="space-y-2">
              {/* Existing checklist items */}
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <span className="w-4 h-4 border border-gray-400 rounded flex-shrink-0" />
                  <span className="flex-1 text-gray-700">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity duration-150"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Input for new item */}
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-gray-300 rounded flex-shrink-0" />
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
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors duration-150"
                  title="Add item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <textarea
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500"
            />
          )}
        </div>

        <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-gray-200/50">
          {/* Color picker and checklist toggle */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`w-6 h-6 rounded-full ${c.class} border border-gray-300 transition-all duration-150 ${
                    color === c.name ? `ring-2 ${c.ring}` : ''
                  }`}
                  title={c.name}
                  aria-label={`Set color to ${c.name}`}
                />
              ))}
            </div>
            {/* Checklist toggle */}
            <button
              type="button"
              onClick={() => setIsChecklist(!isChecklist)}
              className={`p-1.5 rounded transition-colors duration-150 ${
                isChecklist ? 'text-blue-600 bg-blue-100' : 'text-gray-500 hover:bg-black/5'
              }`}
              title={isChecklist ? 'Switch to text note' : 'Switch to checklist'}
              aria-label={isChecklist ? 'Switch to text note' : 'Switch to checklist'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
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
    </div>
  )
}
