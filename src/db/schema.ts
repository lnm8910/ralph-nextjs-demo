import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Note: This is a placeholder schema. Ralph will implement the full schema in US-001.
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})
