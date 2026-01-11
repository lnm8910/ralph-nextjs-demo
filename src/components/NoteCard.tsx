'use client'

import type { Note } from '@/db/schema'

const colorClasses: Record<string, string> = {
  yellow: 'bg-amber-100',
  green: 'bg-emerald-100',
  blue: 'bg-blue-100',
  pink: 'bg-pink-100',
  purple: 'bg-violet-100',
  gray: 'bg-gray-100',
}

interface NoteCardProps {
  note: Note
  onPin?: (note: Note) => void
  onArchive?: (note: Note) => void
  onDelete?: (note: Note) => void
  onClick?: (note: Note) => void
}

export function NoteCard({ note, onPin, onArchive, onDelete, onClick }: NoteCardProps) {
  const bgColor = colorClasses[note.color] || colorClasses.yellow

  return (
    <div
      className={`group relative rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer transition-shadow hover:shadow-md ${bgColor}`}
      onClick={() => onClick?.(note)}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-2 right-2">
          <PinFilledIcon className="h-4 w-4 text-gray-600" />
        </div>
      )}

      {/* Title */}
      {note.title && (
        <h3 className="font-medium text-gray-900 mb-2 pr-6">{note.title}</h3>
      )}

      {/* Content */}
      {note.content && (
        <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.content}</p>
      )}

      {/* Action buttons - visible on hover */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin?.(note)
          }}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
          title={note.pinned ? 'Unpin' : 'Pin'}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
        >
          {note.pinned ? (
            <PinFilledIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <PinOutlineIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onArchive?.(note)
          }}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
          title="Archive"
          aria-label="Archive note"
        >
          <ArchiveIcon className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(note)
          }}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
          title="Delete"
          aria-label="Delete note"
        >
          <DeleteIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  )
}

// Icon components
function PinFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4l3 3-1.5 1.5L16 7l-4 4 1 5-1.5 1.5-3-3-4.5 4.5-1-1 4.5-4.5-3-3L6 9l5 1 4-4-1.5-1.5L16 4z" />
    </svg>
  )
}

function PinOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4l3 3-1.5 1.5L16 7l-4 4 1 5-1.5 1.5-3-3-4.5 4.5-1-1 4.5-4.5-3-3L6 9l5 1 4-4-1.5-1.5L16 4z" />
    </svg>
  )
}

function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 8v13H3V8M1 3h22v5H1V3zM10 12h4" />
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
