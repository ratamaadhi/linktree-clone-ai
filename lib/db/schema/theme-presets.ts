import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { organizations } from './organization';

export const themePresets = pgTable(
  'theme_presets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'cascade',
    }),

    // Preset Information
    name: text('name').notNull(),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),

    // Theme Configuration
    themeConfig: jsonb('theme_config').notNull(),

    // System Presets (cannot be deleted)
    isSystemPreset: boolean('is_system_preset').default(false).notNull(),

    // Usage Statistics
    usageCount: integer('usage_count').default(0).notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('theme_presets_user_id_idx').on(table.userId),
    index('theme_presets_org_id_idx').on(table.organizationId),
  ]
);
