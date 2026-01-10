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
import { bioPages } from './bio-pages';

export const bioLinks = pgTable(
  'bio_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bioPageId: uuid('bio_page_id')
      .notNull()
      .references(() => bioPages.id, { onDelete: 'cascade' }),

    // Link Information
    title: text('title').notNull(),
    url: text('url').notNull(),
    description: text('description'),
    iconUrl: text('icon_url'),
    imageUrl: text('image_url'),

    // Visibility Control
    isActive: boolean('is_active').default(true).notNull(),

    // Ordering
    order: integer('order').default(0).notNull(),

    // Individual Theme Configuration (overrides page theme)
    themeConfig: jsonb('theme_config').$type<{
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
      hoverColor?: string;
      buttonStyle?: 'solid' | 'outline' | 'ghost';
      borderRadius?: number;
      borderWidth?: number;
      shadow?: 'none' | 'small' | 'medium' | 'large';
      fontSize?: string;
      fontWeight?: number;
      padding?: string;
      margin?: string;
      iconPosition?: 'left' | 'right' | 'none';
      iconSize?: 'small' | 'medium' | 'large';
      showImage?: boolean;
      imagePosition?: 'left' | 'right' | 'background';
      imageSize?: 'small' | 'medium' | 'large';
    }>(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('bio_links_page_id_idx').on(table.bioPageId),
    index('bio_links_order_idx').on(table.bioPageId, table.order),
  ]
);
