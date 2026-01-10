import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { organizations } from './organization';

export const bioPages = pgTable(
  'bio_pages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').references(() => organizations.id, {
      onDelete: 'cascade',
    }),

    // Basic Information
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    avatarUrl: text('avatar_url'),

    // Visibility Control
    isActive: boolean('is_active').default(true).notNull(),
    publishedAt: timestamp('published_at'),

    // Theme Configuration (JSONB for flexible storage)
    themeConfig: jsonb('theme_config').$type<{
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      textColor: string;
      secondaryTextColor: string;
      fontFamily: string;
      fontSize: {
        base: string;
        heading: string;
        small: string;
      };
      fontWeight: {
        normal: number;
        medium: number;
        bold: number;
      };
      spacing: 'compact' | 'normal' | 'relaxed';
      padding: {
        page: string;
        section: string;
        link: string;
      };
      layout: 'vertical' | 'grid';
      maxWidth: string;
      alignment: 'left' | 'center' | 'right';
      buttonStyle: 'solid' | 'outline' | 'ghost';
      borderRadius: number;
      borderWidth: number;
      shadow: 'none' | 'small' | 'medium' | 'large';
      avatarShape: 'circle' | 'square' | 'rounded';
      avatarSize: 'small' | 'medium' | 'large';
      animation: 'none' | 'fade' | 'slide' | 'scale';
      animationDuration: string;
      backgroundType: 'solid' | 'gradient' | 'image';
      backgroundGradient?: {
        type: 'linear' | 'radial';
        direction?: string;
        colors: string[];
      };
      backgroundImage?: {
        url: string;
        position: 'cover' | 'contain' | 'center';
        opacity: number;
      };
    }>(),

    // Theme Preset Reference
    themePresetId: uuid('theme_preset_id'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('bio_pages_user_id_idx').on(table.userId),
    index('bio_pages_slug_idx').on(table.slug),
    index('bio_pages_org_id_idx').on(table.organizationId),
  ]
);
