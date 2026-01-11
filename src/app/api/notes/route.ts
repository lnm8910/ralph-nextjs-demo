import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { notes, NewNote } from '@/db/schema'

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
    }

    const result = await db.insert(notes).values(newNote).returning()
    const createdNote = result[0]

    return NextResponse.json(createdNote, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
