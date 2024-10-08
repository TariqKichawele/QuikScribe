import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const $notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    imageUrl: text('imageUrl'),
    userId: text('user_id').notNull(),
    editorState: text('editor_state'),
})

export type NoteType = typeof $notes.$inferInsert;