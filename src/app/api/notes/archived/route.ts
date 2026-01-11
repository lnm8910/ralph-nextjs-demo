import { NextResponse } from 'next/server'
import { db } from '@/db'
import { notes, Note, ChecklistItem } from '@/db/schema'
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
    // Get all archived notes, sorted by createdAt desc
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.archived, true))
      .orderBy(desc(notes.createdAt))

    // Parse checklistItems JSON for each note
    const notesWithParsedChecklists = result.map(parseChecklistItems)

    return NextResponse.json(notesWithParsedChecklists)
  } catch (error) {
    console.error('Error fetching archived notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch archived notes' },
      { status: 500 }
    )
  }
}
