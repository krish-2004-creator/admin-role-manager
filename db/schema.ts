
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
