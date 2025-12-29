import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { organizations } from './organization';
import { user } from './auth';

// Activity logs table
export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    metadata: jsonb('metadata'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('activity_logs_org_id_idx').on(table.organizationId),
    index('activity_logs_user_id_idx').on(table.userId),
    index('activity_logs_created_at_idx').on(table.createdAt),
  ]
);

export type ActivityLog = typeof activityLogs.$inferSelect;
