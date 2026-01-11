import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { notes, NewNote, Note, ChecklistItem } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

// Helper to parse checklistItems JSON string
function parseChecklistItems(note: Note): Note & { checklistItems: ChecklistItem[] | null } {
  return {
    ...note,
    checklistItems: note.checklistItems ? JSON.parse(note.checklistItems) : null,
  }
}

export async function GET() {
  try {
    // Get all non-archived notes, pinned first, then by createdAt desc
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.archived, false))
      .orderBy(desc(notes.pinned), desc(notes.createdAt))

    // Parse checklistItems JSON for each note
    const notesWithParsedChecklists = result.map(parseChecklistItems)

    return NextResponse.json(notesWithParsedChecklists)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate that title is not empty
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const newNote: NewNote = {
      title: body.title.trim(),
      content: body.content || null,
      color: body.color || 'yellow',
      pinned: body.pinned ?? false,
      archived: body.archived ?? false,
      isChecklist: body.isChecklist ?? false,
      checklistItems: body.checklistItems ? JSON.stringify(body.checklistItems) : null,
    }

    const result = await db.insert(notes).values(newNote).returning()
    const createdNote = parseChecklistItems(result[0])

    return NextResponse.json(createdNote, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
