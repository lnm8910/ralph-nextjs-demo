import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { notes } from '@/db/schema'
import { eq } from 'drizzle-orm'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const noteId = parseInt(id, 10)

    if (isNaN(noteId)) {
      return NextResponse.json(
        { error: 'Invalid note ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (body.title !== undefined) {
      updateData.title = body.title
    }
    if (body.content !== undefined) {
      updateData.content = body.content
    }
    if (body.color !== undefined) {
      updateData.color = body.color
    }
    if (body.pinned !== undefined) {
      updateData.pinned = body.pinned
    }
    if (body.archived !== undefined) {
      updateData.archived = body.archived
    }

    const result = await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, noteId))
      .returning()

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}
