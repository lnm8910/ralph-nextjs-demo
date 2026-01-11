'use client'

import type { Note, ChecklistItem } from '@/db/schema'

// Extended note type that includes parsed checklistItems from API
export interface NoteWithChecklist extends Omit<Note, 'checklistItems'> {
  checklistItems: ChecklistItem[] | null
}

const colorClasses: Record<string, string> = {
  yellow: 'bg-amber-100',
  green: 'bg-emerald-100',
  blue: 'bg-blue-100',
  pink: 'bg-pink-100',
  purple: 'bg-violet-100',
  gray: 'bg-gray-100',
}

interface NoteCardProps {
  note: NoteWithChecklist
  onPin?: (note: NoteWithChecklist) => void
  onArchive?: (note: NoteWithChecklist) => void
  onDelete?: (note: NoteWithChecklist) => void
  onClick?: (note: NoteWithChecklist) => void
}

export function NoteCard({ note, onPin, onArchive, onDelete, onClick }: NoteCardProps) {
  const bgColor = colorClasses[note.color] || colorClasses.yellow

  return (
    <div
      className={`group relative rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200/80 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.02] ${bgColor}`}
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

      {/* Content - Checklist or regular text */}
      {note.isChecklist && note.checklistItems && note.checklistItems.length > 0 ? (
        <ChecklistDisplay items={note.checklistItems} />
      ) : note.content ? (
        <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.content}</p>
      ) : null}

      {/* Action buttons - visible on hover */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin?.(note)
          }}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors duration-150"
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
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors duration-150"
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
