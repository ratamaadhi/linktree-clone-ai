# Database Schema Design - Bio-Link Management System

## Overview

This document outlines the database schema for an advanced bio-link management application that allows users to create multiple profile pages with customizable themes and analytics.

## Core Tables

### 1. bio_pages

Stores multiple profile pages that can be created by each user.

```typescript
export const bioPages = pgTable(
  'bio_pages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),

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
      fontFamily: string;
      buttonStyle: 'solid' | 'outline' | 'ghost';
      borderRadius: number;
      spacing: 'compact' | 'normal' | 'relaxed';
      layout: 'vertical' | 'grid';
    }>(),

    // Theme Preset Reference
    themePresetId: uuid('theme_preset_id').references(() => themePresets.id),

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
```

### 2. bio_links

Stores individual links within each bio page.

```typescript
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
      backgroundColor: string;
      textColor: string;
      buttonStyle: 'solid' | 'outline' | 'ghost';
      borderRadius: number;
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
```

### 3. theme_presets

Stores reusable theme configurations that can be applied to bio pages.

```typescript
export const themePresets = pgTable(
  'theme_presets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),

    // Preset Information
    name: text('name').notNull(),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),

    // Theme Configuration
    themeConfig: jsonb('theme_config').notNull().$type<{
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
      textColor: string;
      fontFamily: string;
      buttonStyle: 'solid' | 'outline' | 'ghost';
      borderRadius: number;
      spacing: 'compact' | 'normal' | 'relaxed';
      layout: 'vertical' | 'grid';
    }>(),

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
```

### 4. link_analytics

Stores click tracking and analytics data for each link.

```typescript
export const linkAnalytics = pgTable(
  'link_analytics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bioLinkId: uuid('bio_link_id')
      .notNull()
      .references(() => bioLinks.id, { onDelete: 'cascade' }),
    bioPageId: uuid('bio_page_id')
      .notNull()
      .references(() => bioPages.id, { onDelete: 'cascade' }),

    // Click Information
    clickedAt: timestamp('clicked_at').defaultNow().notNull(),

    // Visitor Information (optional)
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    referrer: text('referrer'),
    country: text('country'),
    city: text('city'),
    deviceType: text('device_type'), // 'desktop', 'mobile', 'tablet'
    browser: text('browser'),

    // Custom Parameters (for tracking campaigns, etc.)
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
  },
  (table) => [
    index('link_analytics_link_id_idx').on(table.bioLinkId),
    index('link_analytics_page_id_idx').on(table.bioPageId),
    index('link_analytics_clicked_at_idx').on(table.clickedAt),
    index('link_analytics_date_idx').on(sql`DATE(${table.clickedAt})`),
  ]
);
```

### 5. link_analytics_aggregates

Pre-computed aggregated statistics for faster dashboard queries.

```typescript
export const linkAnalyticsAggregates = pgTable(
  'link_analytics_aggregates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bioLinkId: uuid('bio_link_id')
      .notNull()
      .references(() => bioLinks.id, { onDelete: 'cascade' }),
    bioPageId: uuid('bio_page_id')
      .notNull()
      .references(() => bioPages.id, { onDelete: 'cascade' }),

    // Date Range
    date: date('date').notNull(),

    // Aggregated Metrics
    totalClicks: integer('total_clicks').default(0).notNull(),
    uniqueClicks: integer('unique_clicks').default(0).notNull(),

    // Device Breakdown
    desktopClicks: integer('desktop_clicks').default(0).notNull(),
    mobileClicks: integer('mobile_clicks').default(0).notNull(),
    tabletClicks: integer('tablet_clicks').default(0).notNull(),

    // Top Referrers (JSON array)
    topReferrers: jsonb('top_referrers').$type<Array<{
      referrer: string;
      count: number;
    }>>(),

    // Geographic Distribution (JSON object)
    topCountries: jsonb('top_countries').$type<Record<string, number>>(),

    // Updated At
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('analytics_agg_link_date_idx').on(table.bioLinkId, table.date),
    index('analytics_agg_page_date_idx').on(table.bioPageId, table.date),
  ]
);
```

## Enums

```typescript
export const buttonStyleEnum = pgEnum('button_style', ['solid', 'outline', 'ghost']);
export const spacingEnum = pgEnum('spacing', ['compact', 'normal', 'relaxed']);
export const layoutEnum = pgEnum('layout', ['vertical', 'grid']);
export const deviceTypeEnum = pgEnum('device_type', ['desktop', 'mobile', 'tablet']);
```

## Relationships

### BioPage Relations

- Belongs to User (many-to-one)
- Belongs to Organization (optional, many-to-one)
- Has many BioLinks (one-to-many)
- Belongs to ThemePreset (optional, many-to-one)
- Has many LinkAnalytics (one-to-many)

### BioLink Relations

- Belongs to BioPage (many-to-one)
- Has many LinkAnalytics (one-to-many)

### ThemePreset Relations

- Belongs to User (many-to-one)
- Belongs to Organization (optional, many-to-one)
- Has many BioPages (one-to-many)

### LinkAnalytics Relations

- Belongs to BioLink (many-to-one)
- Belongs to BioPage (many-to-one)

## Index Strategy

### Performance Optimization

1. **User-based queries**: Index on `user_id` for bio_pages and theme_presets
2. **Slug lookups**: Unique index on `slug` for bio_pages (public URLs)
3. **Analytics queries**: Composite indexes on `(bio_link_id, clicked_at)` and date-based indexes
4. **Ordering**: Composite index on `(bio_page_id, order)` for link ordering
5. **Aggregation**: Date-based indexes for efficient time-series queries

### Query Patterns

- Fetch user's bio pages: `WHERE user_id = ? ORDER BY created_at DESC`
- Fetch bio page by slug: `WHERE slug = ?`
- Fetch links for a page: `WHERE bio_page_id = ? ORDER BY order ASC`
- Fetch analytics for a link: `WHERE bio_link_id = ? AND clicked_at >= ?`
- Fetch aggregated stats: `WHERE bio_page_id = ? AND date >= ?`

## Data Types

### JSONB Fields

- `theme_config`: Stores flexible theme configurations
- `top_referrers`: Array of referrer objects
- `top_countries`: Key-value pairs of country codes and counts

### Timestamps

- All tables use `created_at` and `updated_at`
- Analytics uses `clicked_at` for precise click timing
- Aggregates use `date` for daily summaries

## Constraints

### Foreign Keys

- All foreign keys use `ON DELETE CASCADE` for automatic cleanup
- Optional relationships (organizationId, themePresetId) allow NULL values

### Unique Constraints

- `bio_pages.slug` must be unique globally
- `user.email` is already unique (from auth schema)

### Default Values

- `isActive` defaults to `true`
- `order` defaults to `0`
- `usageCount` defaults to `0`
- All timestamps default to `NOW()`

## Migration Strategy

1. Create new tables in order of dependencies
2. Add indexes after table creation
3. Create composite indexes for complex queries
4. Add foreign key constraints
5. Create views for common queries (optional)

## Security Considerations

1. **Row-Level Security**: Implement RLS policies to ensure users can only access their own data
2. **Input Validation**: Validate URLs, colors, and other user inputs
3. **Rate Limiting**: Protect analytics endpoints from abuse
4. **IP Anonymization**: Consider hashing IP addresses for privacy compliance

## Scalability Considerations

1. **Partitioning**: Consider partitioning `link_analytics` by date for large datasets
2. **Archiving**: Implement archiving strategy for old analytics data
3. **Caching**: Cache frequently accessed bio pages and theme presets
4. **Materialized Views**: Use materialized views for complex analytics aggregations
