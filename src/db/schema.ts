import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  color: text('color').notNull().default('yellow'),
  pinned: integer('pinned', { mode: 'boolean' }).notNull().default(false),
  archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
  isChecklist: integer('is_checklist', { mode: 'boolean' }).notNull().default(false),
  checklistItems: text('checklist_items'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert
