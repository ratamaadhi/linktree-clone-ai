import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'owner',
  'admin',
  'member',
  'viewer',
]);

// Organizations table
export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    ownerId: uuid('owner_id').notNull(),
  },
  (table) => [
    index('organizations_slug_idx').on(table.slug),
    index('organizations_owner_id_idx').on(table.ownerId),
  ]
);

// Organization members table
export const organizationMembers = pgTable(
  'organization_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull(),
    role: userRoleEnum('role').notNull().default('member'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('org_members_org_user_idx').on(table.organizationId, table.userId),
  ]
);

export type Organization = typeof organizations.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
