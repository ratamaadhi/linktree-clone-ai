import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations, userRoleEnum } from './organization';
import { user } from './auth';

// Invitations table
export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: userRoleEnum('role').notNull(),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('invitations_token_idx').on(table.token),
    index('invitations_email_idx').on(table.email),
    index('invitations_sender_idx').on(table.senderId),
  ]
);

export type Invitation = typeof invitations.$inferSelect;
