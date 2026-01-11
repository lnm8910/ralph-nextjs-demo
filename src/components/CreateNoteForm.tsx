'use client'

import { useState } from 'react'

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() && !content.trim()) {
      setExpanded(false)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          color,
        }),
      })

      if (response.ok) {
        setTitle('')
        setContent('')
        setColor('yellow')
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
    if (!title.trim() && !content.trim()) {
      setExpanded(false)
      setColor('yellow')
    }
  }

  const selectedColorClass = colors.find(c => c.name === color)?.class || 'bg-amber-100'

  if (!expanded) {
    return (
      <div
        className="max-w-xl mx-auto mb-8"
        onClick={() => setExpanded(true)}
      >
        <div className="rounded-lg shadow border border-gray-200 p-4 cursor-text hover:shadow-md transition-shadow">
          <span className="text-gray-500">Take a note...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className={`rounded-lg shadow-md border border-gray-200 overflow-hidden ${selectedColorClass}`}
      >
        <div className="p-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-500 mb-2"
            autoFocus
          />
          <textarea
            placeholder="Take a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-500"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200/50">
          {/* Color picker */}
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={`w-6 h-6 rounded-full ${c.class} border border-gray-300 transition-all ${
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
              onClick={handleClose}
              className="px-4 py-1.5 text-sm text-gray-600 hover:bg-black/5 rounded transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
