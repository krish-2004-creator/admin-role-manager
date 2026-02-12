
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role', { enum: ['admin', 'user'] }).default('user').notNull(),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (users) => {
    return {
      uniqueEmailIndex: uniqueIndex('unique_email_idx').on(users.email),
    };
  }
);

export const studyNotes = pgTable(
  'study_notes',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    videoUrl: text('video_url').notNull(),
    videoId: text('video_id').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  }
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type StudyNote = typeof studyNotes.$inferSelect;
export type NewStudyNote = typeof studyNotes.$inferInsert;
