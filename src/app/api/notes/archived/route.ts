import { NextResponse } from 'next/server'
import { db } from '@/db'
import { notes } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    // Get all archived notes, sorted by createdAt desc
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.archived, true))
      .orderBy(desc(notes.createdAt))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching archived notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch archived notes' },
      { status: 500 }
    )
  }
}
