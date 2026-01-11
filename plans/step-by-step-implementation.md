# Step-by-Step Implementation Guide - Bio-Link Management System

## Implementation Status Summary (Last Updated: 2026-01-10)

| Phase                               | Status         | Progress  |
| ----------------------------------- | -------------- | --------- |
| Phase 1: Database Foundation        | ✅ Complete    | 9/9 tasks |
| Phase 2: Core API Development       | ✅ Complete    | 6/6 tasks |
| Phase 3: Theme System               | ✅ Complete    | 5/5 tasks |
| Phase 4: Frontend Components        | ✅ Complete    | 5/5 tasks |
| Phase 5: Live Preview               | ✅ Complete    | 6/6 tasks |
| Phase 6: Analytics Tracking         | ✅ Complete    | 3/3 tasks |
| Phase 7.1: Auth Pages               | ✅ Complete    | 5/5 tasks |
| Phase 7.2: Dashboard Pages          | 🟡 Partial     | 2/5 tasks |
| Phase 7.3: Public Bio Page          | ✅ Complete    | 2/2 tasks |
| Phase 8: Testing                    | ✅ Complete    | 4/4 tasks |
| Phase 9: Performance & Optimization | ⏸️ Not Started | 0/4 tasks |
| Phase 10: Deployment & Launch       | ⏸️ Not Started | 0/4 tasks |

### What's Been Implemented

**Phase 1 - Database Foundation (Complete):**

- All database schemas created in `lib/db/schema/`
- Enums: `enums.ts` (14 enum types for buttons, spacing, layout, animation, shadows, avatars, etc.)
- Tables: `bio-pages.ts`, `bio-links.ts`, `theme-presets.ts`, `link-analytics.ts`, `link-analytics-aggregates.ts`
- Relations: `bio-relations.ts`
- 3 migration files generated and ready to run

**Phase 2 - Core API Development (Complete):**

- Validation schemas in `lib/validations/` (bio-page, bio-link, theme-preset)
- API middleware in `lib/api/middleware.ts` (auth, error handling)
- Bio Pages API: GET/POST `/api/v1/bio-pages`, GET/PUT/DELETE `/api/v1/bio-pages/[id]`, PATCH `/api/v1/bio-pages/[id]/toggle-visibility`
- Bio Links API: GET/POST `/api/v1/bio-pages/[id]/links`, PUT/DELETE `/api/v1/bio-pages/[id]/links/[linkId]`, POST `/api/v1/bio-pages/[id]/links/reorder`
- Theme Presets API: GET/POST `/api/v1/theme-presets`, GET/PUT/DELETE `/api/v1/theme-presets/[id]`
- Analytics API: POST `/api/v1/track-click` (click tracking with batch processing, IP hashing, UTM support)

**Phase 3 - Theme System (Complete):**

- Theme types: `lib/theme/types.ts` (BioPageThemeConfig, BioLinkThemeConfig interfaces)
- CSS generator: `lib/theme/css-generator.ts` (generateThemeCSS, generateLinkThemeCSS with security sanitization)
- Theme provider: `components/theme/theme-provider.tsx` (ThemeProvider component with useTheme hook)
- Default themes: `lib/theme/default-themes.ts` (5 pre-built themes: default, dark, pink, green, amber-grid)
- Theme validator: `lib/theme/validator.ts` (Zod schemas for runtime validation)

**Phase 4 - Frontend Components (Complete):**

- Custom hooks: `lib/hooks/use-bio-pages.ts` (BioPage type, CRUD operations)
- Custom hooks: `lib/hooks/use-bio-links.ts` (BioLink type, CRUD operations, reordering)
- Dashboard layout: `components/layout/dashboard-layout.tsx` (Main layout with sidebar)
- Sidebar: `components/layout/sidebar.tsx` (Navigation with collapsible menu, sign out)
- Header: `components/layout/header.tsx` (Top header with menu button and user actions)
- Mobile nav: `components/layout/mobile-nav.tsx` (Bottom navigation for mobile)
- Bio page card: `components/bio-pages/bio-page-card.tsx` (Individual bio page with actions)
- Bio page list: `components/bio-pages/bio-page-list.tsx` (Grid of bio pages, empty states)
- Bio page editor: `components/bio-pages/bio-page-editor.tsx` (Form for creating/editing bio pages)
- Bio link card: `components/bio-links/bio-link-card.tsx` (Draggable link card with actions)
- Bio link list: `components/bio-links/bio-link-list.tsx` (Sortable list with drag-and-drop)
- Bio link editor: `components/bio-links/bio-link-editor.tsx` (Form for creating/editing links)
- Shared loading: `components/shared/loading.tsx` (LoadingSpinner, LoadingState components)
- Shared error: `components/shared/error.tsx` (ErrorState, EmptyState components)

**Phase 5 - Live Preview (Complete):**

- Live preview: `components/theme/live-preview/live-preview.tsx` (Main preview with device selection, fullscreen mode)
- Preview frame: `components/theme/live-preview/preview-frame.tsx` (Responsive container for preview)
- Preview content: `components/theme/live-preview/preview-content.tsx` (Bio page content with links)
- Theme injector: `components/theme/live-preview/theme-injector.tsx` (Injects theme CSS into preview)
- Preview controls: `components/theme/live-preview/preview-controls.tsx` (Refresh, open new tab, copy URL, fullscreen)
- Device selector: `components/theme/live-preview/device-selector.tsx` (Mobile, tablet, desktop, custom sizes)

**Phase 7.1: Auth Pages (Complete):**

_All authentication pages implemented in `app/(auth)/` with Better-Auth integration:_

- ✅ Sign in page (`app/(auth)/sign-in/page.tsx`) - Email/password form with Better Auth client
- ✅ Sign up page (`app/(auth)/sign-up/page.tsx`) - Registration with password validation
- ✅ Email verification page (`app/(auth)/verify-email/page.tsx`) - Token-based verification
- ✅ Forgot password page (`app/(auth)/forgot-password/page.tsx`) - Password reset request
- ✅ Reset password page (`app/(auth)/reset-password/page.tsx`) - Password reset with token
- ✅ Auth layout wrapper (`app/(auth)/layout.tsx`) - Shared layout with auto-redirect for authenticated users
- ✅ Dashboard auth guard (`app/(dashboard)/layout.tsx`) - Protected dashboard routes

**Phase 7.2: Dashboard Pages (Partial):**

- ✅ Dashboard layout with auth protection
- ✅ Dashboard home page (`app/(dashboard)/page.tsx`)
- ❌ Bio pages management pages (`/bio-pages`, `/bio-pages/new`, `/bio-pages/[id]`)
- ❌ Bio links management pages
- ❌ Analytics dashboard pages

**Phase 7.3: Public Bio Page (Complete):**

- ✅ Server component (`app/[slug]/page.tsx`) - Fetches bio page and links from database
- ✅ Client component (`app/[slug]/public-bio-page.tsx`) - Renders bio page with theme system and click tracking
- ✅ Theme system integration (page-level and link-level themes)
- ✅ Analytics click tracking integration

**Phase 6 - Analytics Tracking (Complete):**

- User agent parser: `lib/analytics/user-agent-parser.ts` (Detects device type, browser, OS)
- IP hasher: `lib/analytics/ip-hasher.ts` (SHA-256 hashing for privacy)
- Client-side tracker: `lib/analytics/tracker.ts` (Batch processing, UTM capture, keepalive requests)
- Analytics API: `app/api/v1/track-click/route.ts` (Click tracking with device/browser detection)

**Phase 7 - Pages & Routing (In Progress):**

- Public bio page: `app/[slug]/page.tsx` (Server component for fetching bio page data)
- Public bio page client: `app/[slug]/public-bio-page.tsx` (Client component with click tracking integration)

### Next Immediate Steps

1. **Complete Phase 7.2:** Bio pages management pages (CRUD interface for bio pages and links)
2. **Phase 9:** Performance & optimization
3. **Phase 10:** Deployment & launch

---

## Table of Contents

1. [Prerequisites & Setup](#step-0-prerequisites--setup)
2. [Phase 1: Database Foundation](#step-1-database-foundation)
3. [Phase 2: Core API Development](#step-2-core-api-development)
4. [Phase 3: Theme System](#step-3-theme-system)
5. [Phase 4: Frontend Components](#step-4-frontend-components)
6. [Phase 5: Live Preview](#step-5-live-preview)
7. [Phase 6: Analytics Tracking](#step-6-analytics-tracking)
8. [Phase 7. Pages & Routing](#step-7-pages--routing)
9. [Phase 8: Testing](#step-8-testing)
10. [Phase 9: Performance & Optimization](#step-9-performance--optimization)
11. [Phase 10: Deployment & Launch](#step-10-deployment--launch)

---

## Quick Navigation: Auth Pages

- [7.1: Auth Pages Implementation](#step-71-auth-pages-) - Sign in, sign up, email verification, password reset
- [7.2: Dashboard Pages](#step-72-dashboard-pages-) - Dashboard home, bio page editor

---

## Step 0: Prerequisites & Setup

### 0.1 Verify Environment

```bash
# Check Node.js version (requires 20+)
node --version

# Check Bun package manager
bun --version

# Test database connection
bun run db-scripts/test-db-connection.js
```

### 0.2 Create Directory Structure

```bash
# Create necessary directories
mkdir -p lib/{theme,analytics,validations,hooks}
mkdir -p lib/db/schema
mkdir -p app/{api/v1,dashboard,public}
mkdir -p components/{layout,bio-pages,bio-links,theme,analytics,shared,feedback,forms}
mkdir -p tests/{unit,integration,e2e}
```

### 0.3 Install Additional Dependencies

```bash
# Add required packages for the bio-link system
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add react-hook-form @hookform/resolvers
bun add recharts
```

---

## Step 1: Database Foundation

### Step 1.1: Create Database Enums

**File:** `lib/db/schema/enums.ts`

```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

export const buttonStyleEnum = pgEnum('button_style', [
  'solid',
  'outline',
  'ghost',
]);

export const spacingEnum = pgEnum('spacing', ['compact', 'normal', 'relaxed']);

export const layoutEnum = pgEnum('layout', ['vertical', 'grid']);

export const deviceTypeEnum = pgEnum('device_type', [
  'desktop',
  'mobile',
  'tablet',
]);

export const animationEnum = pgEnum('animation', [
  'none',
  'fade',
  'slide',
  'scale',
]);

export const shadowEnum = pgEnum('shadow', [
  'none',
  'small',
  'medium',
  'large',
]);

export const avatarShapeEnum = pgEnum('avatar_shape', [
  'circle',
  'square',
  'rounded',
]);
```

**Commands:**

```bash
# Run after creating the file
bun run db:generate
bun run db:migrate
```

### Step 1.2: Create Bio Pages Table

**File:** `lib/db/schema/bio-pages.ts`

```typescript
import { relations } from 'drizzle-orm';
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
```

**Commands:**

```bash
bun run db:generate
bun run db:migrate
```

### Step 1.3: Create Bio Links Table

**File:** `lib/db/schema/bio-links.ts`

```typescript
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
```

**Commands:**

```bash
bun run db:generate
bun run db:migrate
```

### Step 1.4: Create Theme Presets Table

**File:** `lib/db/schema/theme-presets.ts`

```typescript
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
```

**Commands:**

```bash
bun run db:generate
bun run db:migrate
```

### Step 1.5: Create Analytics Tables

**File:** `lib/db/schema/link-analytics.ts`

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  sql,
} from 'drizzle-orm/pg-core';
import { bioLinks } from './bio-links';
import { bioPages } from './bio-pages';

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
    deviceType: text('device_type'),
    browser: text('browser'),

    // Custom Parameters (for tracking campaigns, etc.)
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    utmTerm: text('utm_term'),
    utmContent: text('utm_content'),
  },
  (table) => [
    index('link_analytics_link_id_idx').on(table.bioLinkId),
    index('link_analytics_page_id_idx').on(table.bioPageId),
    index('link_analytics_clicked_at_idx').on(table.clickedAt),
    index('link_analytics_date_idx').on(sql`DATE(${table.clickedAt})`),
    index('link_analytics_ip_idx').on(table.ipAddress),
  ]
);
```

**File:** `lib/db/schema/link-analytics-aggregates.ts`

```typescript
import {
  pgTable,
  uuid,
  date,
  integer,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { bioLinks } from './bio-links';
import { bioPages } from './bio-pages';

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

    // Browser Breakdown
    chromeClicks: integer('chrome_clicks').default(0).notNull(),
    firefoxClicks: integer('firefox_clicks').default(0).notNull(),
    safariClicks: integer('safari_clicks').default(0).notNull(),
    edgeClicks: integer('edge_clicks').default(0).notNull(),
    otherBrowserClicks: integer('other_browser_clicks').default(0).notNull(),

    // Top Referrers (JSON array)
    topReferrers: jsonb('top_referrers').$type<
      Array<{
        referrer: string;
        count: number;
      }>
    >(),

    // Geographic Distribution (JSON object)
    topCountries: jsonb('top_countries').$type<Record<string, number>>(),

    // UTM Campaign Data
    utmSourceBreakdown: jsonb('utm_source_breakdown').$type<
      Record<string, number>
    >(),
    utmMediumBreakdown: jsonb('utm_medium_breakdown').$type<
      Record<string, number>
    >(),
    utmCampaignBreakdown: jsonb('utm_campaign_breakdown').$type<
      Record<string, number>
    >(),

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

**Commands:**

```bash
bun run db:generate
bun run db:migrate
```

### Step 1.6: Update Schema Exports

**File:** `lib/db/schema/index.ts`

```typescript
// Export all schemas
export * from './auth';
export * from './organization';
export * from './subscription';
export * from './invitation';
export * from './activity';
export * from './relations';

// Bio-link system schemas
export * from './enums';
export * from './bio-pages';
export * from './bio-links';
export * from './theme-presets';
export * from './link-analytics';
export * from './link-analytics-aggregates';
```

### Step 1.7: Create Database Relations

**File:** `lib/db/schema/bio-relations.ts`

```typescript
import { relations } from 'drizzle-orm';
import { bioPages } from './bio-pages';
import { bioLinks } from './bio-links';
import { themePresets } from './theme-presets';
import { linkAnalytics } from './link-analytics';
import { linkAnalyticsAggregates } from './link-analytics-aggregates';

export const bioPagesRelations = relations(bioPages, ({ many, one }) => ({
  links: many(bioLinks),
  themePreset: one(themePresets, {
    fields: [bioPages.themePresetId],
    references: [themePresets.id],
  }),
  analytics: many(linkAnalytics),
  analyticsAggregates: many(linkAnalyticsAggregates),
}));

export const bioLinksRelations = relations(bioLinks, ({ one, many }) => ({
  bioPage: one(bioPages, {
    fields: [bioLinks.bioPageId],
    references: [bioPages.id],
  }),
  analytics: many(linkAnalytics),
  analyticsAggregates: many(linkAnalyticsAggregates),
}));

export const themePresetsRelations = relations(themePresets, ({ many }) => ({
  bioPages: many(bioPages),
}));

export const linkAnalyticsRelations = relations(linkAnalytics, ({ one }) => ({
  bioLink: one(bioLinks, {
    fields: [linkAnalytics.bioLinkId],
    references: [bioLinks.id],
  }),
  bioPage: one(bioPages, {
    fields: [linkAnalytics.bioPageId],
    references: [bioPages.id],
  }),
}));

export const linkAnalyticsAggregatesRelations = relations(
  linkAnalyticsAggregates,
  ({ one }) => ({
    bioLink: one(bioLinks, {
      fields: [linkAnalyticsAggregates.bioLinkId],
      references: [bioLinks.id],
    }),
    bioPage: one(bioPages, {
      fields: [linkAnalyticsAggregates.bioPageId],
      references: [bioPages.id],
    }),
  })
);
```

---

## Step 2: Core API Development

### Step 2.1: Create Validation Schemas

**File:** `lib/validations/bio-page.ts`

```typescript
import { z } from 'zod';

export const bioPageThemeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontFamily: z.string().min(1).max(100),
  fontSize: z.object({
    base: z.string().regex(/^\d+(px|rem|em)$/),
    heading: z.string().regex(/^\d+(px|rem|em)$/),
    small: z.string().regex(/^\d+(px|rem|em)$/),
  }),
  fontWeight: z.object({
    normal: z.number().min(100).max(900),
    medium: z.number().min(100).max(900),
    bold: z.number().min(100).max(900),
  }),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
  padding: z.object({
    page: z.string().regex(/^\d+(px|rem|em)$/),
    section: z.string().regex(/^\d+(px|rem|em)$/),
    link: z.string().regex(/^\d+(px|rem|em)$/),
  }),
  layout: z.enum(['vertical', 'grid']),
  maxWidth: z.string().regex(/^\d+(px|rem|em|%|vw|vh)$/),
  alignment: z.enum(['left', 'center', 'right']),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']),
  borderRadius: z.number().min(0).max(50),
  borderWidth: z.number().min(0).max(10),
  shadow: z.enum(['none', 'small', 'medium', 'large']),
  avatarShape: z.enum(['circle', 'square', 'rounded']),
  avatarSize: z.enum(['small', 'medium', 'large']),
  animation: z.enum(['none', 'fade', 'slide', 'scale']),
  animationDuration: z.string().regex(/^\d+(\.\d+)?s$/),
  backgroundType: z.enum(['solid', 'gradient', 'image']),
  backgroundGradient: z
    .object({
      type: z.enum(['linear', 'radial']),
      direction: z.string().optional(),
      colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(2),
    })
    .optional(),
  backgroundImage: z
    .object({
      url: z.string().url(),
      position: z.enum(['cover', 'contain', 'center']),
      opacity: z.number().min(0).max(1),
    })
    .optional(),
});

export const bioPageSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  themeConfig: bioPageThemeConfigSchema.optional(),
  themePresetId: z.string().uuid().optional(),
});

export const bioPageUpdateSchema = bioPageSchema.partial();

export const bioPageVisibilitySchema = z.object({
  isActive: z.boolean(),
});
```

**File:** `lib/validations/bio-link.ts`

```typescript
import { z } from 'zod';

export const bioLinkThemeConfigSchema = z.object({
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  hoverColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
  borderWidth: z.number().min(0).max(10).optional(),
  shadow: z.enum(['none', 'small', 'medium', 'large']).optional(),
  fontSize: z
    .string()
    .regex(/^\d+(px|rem|em)$/)
    .optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  padding: z
    .string()
    .regex(/^\d+(px|rem|em)$/)
    .optional(),
  margin: z
    .string()
    .regex(/^\d+(px|rem|em)$/)
    .optional(),
  iconPosition: z.enum(['left', 'right', 'none']).optional(),
  iconSize: z.enum(['small', 'medium', 'large']).optional(),
  showImage: z.boolean().optional(),
  imagePosition: z.enum(['left', 'right', 'background']).optional(),
  imageSize: z.enum(['small', 'medium', 'large']).optional(),
});

export const bioLinkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().max(200).optional(),
  iconUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  themeConfig: bioLinkThemeConfigSchema.optional(),
});

export const bioLinkUpdateSchema = bioLinkSchema.partial();

export const bioLinkVisibilitySchema = z.object({
  isActive: z.boolean(),
});

export const bioLinksReorderSchema = z.object({
  links: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().min(0),
    })
  ),
});
```

**File:** `lib/validations/theme-preset.ts`

```typescript
import { z } from './zod';
import { bioPageThemeConfigSchema } from './bio-page';

export const themePresetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url().optional(),
  themeConfig: bioPageThemeConfigSchema,
});

export const themePresetUpdateSchema = themePresetSchema.partial();
```

### Step 2.2: Create API Middleware

**File:** `lib/api/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      { error: { code: 'AUTHENTICATION_ERROR', message: 'Unauthorized' } },
      { status: 401 }
    );
  }

  return session;
}

export async function requireOrgAccess(request: NextRequest, orgId: string) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  // Check if user has access to organization
  // Implementation depends on your organization structure
  return { session };
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}
```

### Step 2.3: Create Bio Pages API Routes

**File:** `app/api/v1/bio-pages/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioPageSchema } from '@/lib/validations/bio-page';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// GET /api/v1/bio-pages - List all bio pages
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions = [eq(bioPages.userId, session.user.id)];

    if (organizationId) {
      conditions.push(eq(bioPages.organizationId, organizationId));
    }

    if (isActive !== null) {
      conditions.push(eq(bioPages.isActive, isActive === 'true'));
    }

    const pages = await db.query.bioPages.findMany({
      where: eq(bioPages.userId, session.user.id),
      orderBy: [desc(bioPages.createdAt)],
      limit,
      offset,
    });

    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(bioPages)
      .where(eq(bioPages.userId, session.user.id));

    return NextResponse.json({
      data: pages,
      pagination: {
        page,
        limit,
        total: total[0].count,
        totalPages: Math.ceil(total[0].count / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/v1/bio-pages - Create new bio page
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const data = bioPageSchema.parse(body);

    // Check if slug is unique
    const existing = await db.query.bioPages.findFirst({
      where: eq(bioPages.slug, data.slug),
    });

    if (existing) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_RESOURCE',
            message: 'Slug already exists',
          },
        },
        { status: 409 }
      );
    }

    const [page] = await db
      .insert(bioPages)
      .values({
        ...data,
        userId: session.user.id,
        publishedAt: data.isActive ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ data: page }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**File:** `app/api/v1/bio-pages/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioPageUpdateSchema } from '@/lib/validations/bio-page';
import { eq, and } from 'drizzle-orm';

// GET /api/v1/bio-pages/:id - Get single bio page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const page = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
      with: {
        links: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: page });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/v1/bio-pages/:id - Update bio page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const data = bioPageUpdateSchema.parse(body);

    // Verify ownership
    const existing = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.bioPages.findFirst({
        where: eq(bioPages.slug, data.slug),
      });

      if (slugExists) {
        return NextResponse.json(
          {
            error: {
              code: 'DUPLICATE_RESOURCE',
              message: 'Slug already exists',
            },
          },
          { status: 409 }
        );
      }
    }

    const [page] = await db
      .update(bioPages)
      .set({
        ...data,
        updatedAt: new Date(),
        publishedAt:
          data.isActive && !existing.isActive
            ? new Date()
            : existing.publishedAt,
      })
      .where(eq(bioPages.id, params.id))
      .returning();

    return NextResponse.json({ data: page });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/v1/bio-pages/:id - Delete bio page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify ownership
    const existing = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    await db.delete(bioPages).where(eq(bioPages.id, params.id));

    return NextResponse.json({ message: 'Bio page deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**File:** `app/api/v1/bio-pages/[id]/toggle-visibility/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioPageVisibilitySchema } from '@/lib/validations/bio-page';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const { isActive } = bioPageVisibilitySchema.parse(body);

    // Verify ownership
    const existing = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    const [page] = await db
      .update(bioPages)
      .set({
        isActive,
        publishedAt:
          isActive && !existing.publishedAt ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(bioPages.id, params.id))
      .returning();

    return NextResponse.json({ data: page });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Step 2.4: Create Bio Links API Routes

**File:** `app/api/v1/bio-pages/[pageId]/links/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioLinkSchema } from '@/lib/validations/bio-link';
import { eq, and, asc } from 'drizzle-orm';

// GET /api/v1/bio-pages/:pageId/links - List links
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const conditions = [eq(bioLinks.bioPageId, params.pageId)];

    if (isActive !== null) {
      conditions.push(eq(bioLinks.isActive, isActive === 'true'));
    }

    const links = await db.query.bioLinks.findMany({
      where: eq(bioLinks.bioPageId, params.pageId),
      orderBy: [asc(bioLinks.order)],
    });

    return NextResponse.json({ data: links });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/v1/bio-pages/:pageId/links - Create link
export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = bioLinkSchema.parse(body);

    const [link] = await db
      .insert(bioLinks)
      .values({
        ...data,
        bioPageId: params.pageId,
      })
      .returning();

    return NextResponse.json({ data: link }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**File:** `app/api/v1/bio-pages/[pageId]/links/[linkId]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioLinkUpdateSchema } from '@/lib/validations/bio-link';
import { eq, and } from 'drizzle-orm';

// PUT /api/v1/bio-pages/:pageId/links/:linkId - Update link
export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string; linkId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = bioLinkUpdateSchema.parse(body);

    const [link] = await db
      .update(bioLinks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, params.linkId))
      .returning();

    return NextResponse.json({ data: link });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/v1/bio-pages/:pageId/links/:linkId - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string; linkId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    await db.delete(bioLinks).where(eq(bioLinks.id, params.linkId));

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**File:** `app/api/v1/bio-pages/[pageId]/links/reorder/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioLinksReorderSchema } from '@/lib/validations/bio-link';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { links } = bioLinksReorderSchema.parse(body);

    // Update all links in a transaction
    await db.transaction(async (tx) => {
      for (const link of links) {
        await tx
          .update(bioLinks)
          .set({ order: link.order })
          .where(eq(bioLinks.id, link.id));
      }
    });

    return NextResponse.json({
      message: 'Links reordered successfully',
      data: links,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Step 2.5: Create Theme Presets API Routes

**File:** `app/api/v1/theme-presets/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themePresets } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { themePresetSchema } from '@/lib/validations/theme-preset';
import { eq, desc, or } from 'drizzle-orm';

// GET /api/v1/theme-presets - List theme presets
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const isSystemPreset = searchParams.get('isSystemPreset');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions = [
      or(
        eq(themePresets.userId, session.user.id),
        eq(themePresets.isSystemPreset, true)
      ),
    ];

    if (organizationId) {
      conditions.push(eq(themePresets.organizationId, organizationId));
    }

    if (isSystemPreset !== null) {
      conditions.push(
        eq(themePresets.isSystemPreset, isSystemPreset === 'true')
      );
    }

    const presets = await db.query.themePresets.findMany({
      where: or(
        eq(themePresets.userId, session.user.id),
        eq(themePresets.isSystemPreset, true)
      ),
      orderBy: [desc(themePresets.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({ data: presets });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/v1/theme-presets - Create theme preset
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const data = themePresetSchema.parse(body);

    const [preset] = await db
      .insert(themePresets)
      .values({
        ...data,
        userId: session.user.id,
        isSystemPreset: false,
        usageCount: 0,
      })
      .returning();

    return NextResponse.json({ data: preset }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## Step 3: Theme System

### Step 3.1: Create Theme Types

**File:** `lib/theme/types.ts`

```typescript
export interface BioPageThemeConfig {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;

  // Typography
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

  // Spacing
  spacing: 'compact' | 'normal' | 'relaxed';
  padding: {
    page: string;
    section: string;
    link: string;
  };

  // Layout
  layout: 'vertical' | 'grid';
  maxWidth: string;
  alignment: 'left' | 'center' | 'right';

  // Button/Link Styling
  buttonStyle: 'solid' | 'outline' | 'ghost';
  borderRadius: number;
  borderWidth: number;
  shadow: 'none' | 'small' | 'medium' | 'large';

  // Avatar
  avatarShape: 'circle' | 'square' | 'rounded';
  avatarSize: 'small' | 'medium' | 'large';

  // Animations
  animation: 'none' | 'fade' | 'slide' | 'scale';
  animationDuration: string;

  // Background
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
}

export interface BioLinkThemeConfig {
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
}
```

### Step 3.2: Create Theme CSS Generator

**File:** `lib/theme/css-generator.ts`

```typescript
import type { BioPageThemeConfig, BioLinkThemeConfig } from './types';

export function generateThemeCSS(theme: BioPageThemeConfig): string {
  return `
    :root {
      /* Colors */
      --theme-primary: ${theme.primaryColor};
      --theme-secondary: ${theme.secondaryColor};
      --theme-background: ${theme.backgroundColor};
      --theme-text: ${theme.textColor};
      --theme-text-secondary: ${theme.secondaryTextColor};

      /* Typography */
      --theme-font-family: ${theme.fontFamily};
      --theme-font-size-base: ${theme.fontSize.base};
      --theme-font-size-heading: ${theme.fontSize.heading};
      --theme-font-size-small: ${theme.fontSize.small};
      --theme-font-weight-normal: ${theme.fontWeight.normal};
      --theme-font-weight-medium: ${theme.fontWeight.medium};
      --theme-font-weight-bold: ${theme.fontWeight.bold};

      /* Spacing */
      --theme-padding-page: ${theme.padding.page};
      --theme-padding-section: ${theme.padding.section};
      --theme-padding-link: ${theme.padding.link};

      /* Layout */
      --theme-max-width: ${theme.maxWidth};
      --theme-alignment: ${theme.alignment};

      /* Border */
      --theme-border-radius: ${theme.borderRadius}px;
      --theme-border-width: ${theme.borderWidth}px;

      /* Shadow */
      --theme-shadow: ${getShadowValue(theme.shadow)};

      /* Animation */
      --theme-animation-duration: ${theme.animationDuration};
    }

    .bio-page {
      font-family: var(--theme-font-family);
      background: ${getBackgroundCSS(theme)};
      color: var(--theme-text);
      text-align: var(--theme-alignment);
      max-width: var(--theme-max-width);
      margin: 0 auto;
      padding: var(--theme-padding-page);
    }

    .bio-link {
      border-radius: var(--theme-border-radius);
      padding: var(--theme-padding-link);
      ${getButtonStyleCSS(theme.buttonStyle, theme.primaryColor, theme.textColor)}
      box-shadow: var(--theme-shadow);
      ${getAnimationCSS(theme.animation)}
      transition: all 0.2s ease;
    }

    .bio-link:hover {
      ${getHoverCSS(theme)}
    }

    .bio-avatar {
      border-radius: ${getAvatarRadius(theme.avatarShape)};
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;
}

export function generateLinkThemeCSS(
  linkTheme: BioLinkThemeConfig,
  pageTheme: BioPageThemeConfig
): string {
  return `
    .bio-link.custom-theme {
      ${linkTheme.backgroundColor ? `background-color: ${linkTheme.backgroundColor};` : ''}
      ${linkTheme.textColor ? `color: ${linkTheme.textColor};` : ''}
      ${linkTheme.borderColor ? `border-color: ${linkTheme.borderColor};` : ''}
      ${linkTheme.borderRadius !== undefined ? `border-radius: ${linkTheme.borderRadius}px;` : ''}
      ${linkTheme.borderWidth !== undefined ? `border-width: ${linkTheme.borderWidth}px;` : ''}
      ${linkTheme.fontSize ? `font-size: ${linkTheme.fontSize};` : ''}
      ${linkTheme.fontWeight ? `font-weight: ${linkTheme.fontWeight};` : ''}
      ${linkTheme.padding ? `padding: ${linkTheme.padding};` : ''}
      ${linkTheme.margin ? `margin: ${linkTheme.margin};` : ''}
      ${linkTheme.shadow ? `box-shadow: ${getShadowValue(linkTheme.shadow)};` : ''}
    }

    .bio-link.custom-theme:hover {
      ${linkTheme.hoverColor ? `background-color: ${linkTheme.hoverColor};` : ''}
    }
  `;
}

function getBackgroundCSS(theme: BioPageThemeConfig): string {
  switch (theme.backgroundType) {
    case 'gradient':
      if (theme.backgroundGradient) {
        const { type, direction, colors } = theme.backgroundGradient;
        if (type === 'linear') {
          return `linear-gradient(${direction || '45deg'}, ${colors.join(', ')})`;
        } else {
          return `radial-gradient(${colors.join(', ')})`;
        }
      }
      return theme.backgroundColor;
    case 'image':
      if (theme.backgroundImage) {
        return `
          url(${theme.backgroundImage.url}) ${theme.backgroundImage.position} / cover no-repeat,
          ${theme.backgroundColor}
        `;
      }
      return theme.backgroundColor;
    default:
      return theme.backgroundColor;
  }
}

function getButtonStyleCSS(
  style: 'solid' | 'outline' | 'ghost',
  primaryColor: string,
  textColor: string
): string {
  switch (style) {
    case 'solid':
      return `
        background-color: ${primaryColor};
        color: ${textColor};
        border: none;
      `;
    case 'outline':
      return `
        background-color: transparent;
        color: ${primaryColor};
        border: var(--theme-border-width) solid ${primaryColor};
      `;
    case 'ghost':
      return `
        background-color: transparent;
        color: ${textColor};
        border: none;
      `;
  }
}

function getShadowValue(shadow: 'none' | 'small' | 'medium' | 'large'): string {
  switch (shadow) {
    case 'small':
      return '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    case 'medium':
      return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    case 'large':
      return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    default:
      return 'none';
  }
}

function getAnimationCSS(
  animation: 'none' | 'fade' | 'slide' | 'scale'
): string {
  switch (animation) {
    case 'fade':
      return 'animation: fadeIn var(--theme-animation-duration) ease-in-out;';
    case 'slide':
      return 'animation: slideIn var(--theme-animation-duration) ease-in-out;';
    case 'scale':
      return 'animation: scaleIn var(--theme-animation-duration) ease-in-out;';
    default:
      return '';
  }
}

function getHoverCSS(theme: BioPageThemeConfig): string {
  return `
    transform: translateY(-2px);
    box-shadow: ${getHoverShadow(theme.shadow)};
  `;
}

function getHoverShadow(shadow: 'none' | 'small' | 'medium' | 'large'): string {
  switch (shadow) {
    case 'small':
      return '0 2px 4px 0 rgba(0, 0, 0, 0.1)';
    case 'medium':
      return '0 6px 8px -1px rgba(0, 0, 0, 0.15), 0 3px 5px -1px rgba(0, 0, 0, 0.1)';
    case 'large':
      return '0 15px 20px -3px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1)';
    default:
      return 'none';
  }
}

function getAvatarRadius(shape: 'circle' | 'square' | 'rounded'): string {
  switch (shape) {
    case 'circle':
      return '50%';
    case 'square':
      return '0';
    case 'rounded':
      return '12px';
  }
}
```

### Step 3.3: Create Theme Provider

**File:** `components/theme/theme-provider.tsx`

```typescript
'use client';

import * as React from 'react';
import type { BioPageThemeConfig } from '@/lib/theme/types';
import { getDefaultTheme } from '@/lib/theme/default-themes';

interface ThemeContextValue {
  theme: BioPageThemeConfig;
  updateTheme: (updates: Partial<BioPageThemeConfig>) => void;
  resetTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: BioPageThemeConfig;
}) {
  const [theme, setTheme] = React.useState<BioPageThemeConfig>(
    initialTheme || getDefaultTheme()
  );

  const updateTheme = React.useCallback(
    (updates: Partial<BioPageThemeConfig>) => {
      setTheme((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetTheme = React.useCallback(() => {
    setTheme(getDefaultTheme());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### Step 3.4: Create Default Themes

**File:** `lib/theme/default-themes.ts`

```typescript
import type { BioPageThemeConfig } from './types';

export const defaultThemes: BioPageThemeConfig[] = [
  {
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading: '24px',
      small: '14px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    spacing: 'normal',
    padding: {
      page: '24px',
      section: '16px',
      link: '12px',
    },
    layout: 'vertical',
    maxWidth: '600px',
    alignment: 'center',
    buttonStyle: 'solid',
    borderRadius: 8,
    borderWidth: 0,
    shadow: 'small',
    avatarShape: 'circle',
    avatarSize: 'medium',
    animation: 'fade',
    animationDuration: '0.3s',
    backgroundType: 'solid',
  },
  {
    primaryColor: '#60a5fa',
    secondaryColor: '#a78bfa',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    secondaryTextColor: '#9ca3af',
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading: '24px',
      small: '14px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    spacing: 'normal',
    padding: {
      page: '24px',
      section: '16px',
      link: '12px',
    },
    layout: 'vertical',
    maxWidth: '600px',
    alignment: 'center',
    buttonStyle: 'outline',
    borderRadius: 12,
    borderWidth: 2,
    shadow: 'medium',
    avatarShape: 'circle',
    avatarSize: 'medium',
    animation: 'slide',
    animationDuration: '0.3s',
    backgroundType: 'solid',
  },
];

export function getDefaultTheme(): BioPageThemeConfig {
  return defaultThemes[0];
}
```

### Step 3.5: Create Theme Validator

**File:** `lib/theme/validator.ts`

```typescript
import { z } from 'zod';
import type { BioPageThemeConfig, BioLinkThemeConfig } from './types';

export const bioPageThemeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontFamily: z.string(),
  fontSize: z.object({
    base: z.string(),
    heading: z.string(),
    small: z.string(),
  }),
  fontWeight: z.object({
    normal: z.number().min(100).max(900),
    medium: z.number().min(100).max(900),
    bold: z.number().min(100).max(900),
  }),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
  padding: z.object({
    page: z.string(),
    section: z.string(),
    link: z.string(),
  }),
  layout: z.enum(['vertical', 'grid']),
  maxWidth: z.string(),
  alignment: z.enum(['left', 'center', 'right']),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']),
  borderRadius: z.number().min(0).max(50),
  borderWidth: z.number().min(0).max(10),
  shadow: z.enum(['none', 'small', 'medium', 'large']),
  avatarShape: z.enum(['circle', 'square', 'rounded']),
  avatarSize: z.enum(['small', 'medium', 'large']),
  animation: z.enum(['none', 'fade', 'slide', 'scale']),
  animationDuration: z.string(),
  backgroundType: z.enum(['solid', 'gradient', 'image']),
  backgroundGradient: z
    .object({
      type: z.enum(['linear', 'radial']),
      direction: z.string().optional(),
      colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)),
    })
    .optional(),
  backgroundImage: z
    .object({
      url: z.string().url(),
      position: z.enum(['cover', 'contain', 'center']),
      opacity: z.number().min(0).max(1),
    })
    .optional(),
});

export const bioLinkThemeConfigSchema = z.object({
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  hoverColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
  borderWidth: z.number().min(0).max(10).optional(),
  shadow: z.enum(['none', 'small', 'medium', 'large']).optional(),
  fontSize: z.string().optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  iconPosition: z.enum(['left', 'right', 'none']).optional(),
  iconSize: z.enum(['small', 'medium', 'large']).optional(),
  showImage: z.boolean().optional(),
  imagePosition: z.enum(['left', 'right', 'background']).optional(),
  imageSize: z.enum(['small', 'medium', 'large']).optional(),
});

export function validateThemeConfig(config: unknown): BioPageThemeConfig {
  return bioPageThemeConfigSchema.parse(config);
}

export function validateLinkThemeConfig(config: unknown): BioLinkThemeConfig {
  return bioLinkThemeConfigSchema.parse(config);
}
```

---

## Step 4: Frontend Components

### Step 4.1: Create Custom Hooks

**File:** `lib/hooks/use-bio-pages.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useBioPages() {
  const queryClient = useQueryClient();

  const {
    data: bioPages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bio-pages'],
    queryFn: async () => {
      const response = await fetch('/api/v1/bio-pages');
      if (!response.ok) throw new Error('Failed to fetch bio pages');
      const result = await response.json();
      return result.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await fetch('/api/v1/bio-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create bio page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const response = await fetch(`/api/v1/bio-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update bio page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/v1/bio-pages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete bio page');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  return {
    bioPages,
    loading: isLoading,
    error,
    createPage: createMutation.mutateAsync,
    updatePage: updateMutation.mutateAsync,
    deletePage: deleteMutation.mutateAsync,
  };
}
```

**File:** `lib/hooks/use-bio-links.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useBioLinks(bioPageId: string) {
  const queryClient = useQueryClient();

  const {
    data: links = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bio-links', bioPageId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/bio-pages/${bioPageId}/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const result = await response.json();
      return result.data;
    },
    enabled: !!bioPageId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await fetch(`/api/v1/bio-pages/${bioPageId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create link');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ linkId, data }: { linkId: string; data: unknown }) => {
      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/links/${linkId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Failed to update link');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/links/${linkId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete link');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (links: Array<{ id: string; order: number }>) => {
      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/links/reorder`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ links }),
        }
      );
      if (!response.ok) throw new Error('Failed to reorder links');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  return {
    links,
    loading: isLoading,
    error,
    createLink: createMutation.mutateAsync,
    updateLink: updateMutation.mutateAsync,
    deleteLink: deleteMutation.mutateAsync,
    reorderLinks: reorderMutation.mutateAsync,
  };
}
```

### Step 4.2: Create Dashboard Layout

**File:** `components/layout/dashboard-layout.tsx`

```typescript
'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
```

---

## Step 5: Live Preview

### Step 5.1: Create Live Preview Component

**File:** `components/theme/live-preview/index.tsx`

```typescript
'use client';

import * as React from 'react';
import { useTheme } from '../theme-provider';
import { generateThemeCSS } from '@/lib/theme/css-generator';
import { DeviceSelector } from './device-selector';
import { PreviewControls } from './preview-controls';

interface LivePreviewProps {
  bioPage: {
    title: string;
    description: string;
    avatarUrl: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
      iconUrl?: string;
      imageUrl?: string;
      isActive: boolean;
      themeConfig?: Record<string, unknown>;
    }>;
  };
  editable?: boolean;
}

export function LivePreview({ bioPage, editable = true }: LivePreviewProps) {
  const { theme } = useTheme();
  const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [customSize, setCustomSize] = React.useState({ width: 600, height: 800 });

  const themeCSS = React.useMemo(() => generateThemeCSS(theme), [theme]);

  const activeLinks = React.useMemo(
    () => bioPage.links.filter((link) => link.isActive),
    [bioPage.links]
  );

  function getDeviceSize() {
    switch (device) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      case 'desktop':
        return { width: 600, height: 800 };
      default:
        return { width: 600, height: 800 };
    }
  }

  return (
    <div className="live-preview">
      {editable && (
        <>
          <PreviewControls />
          <DeviceSelector
            device={device}
            onDeviceChange={setDevice}
            customSize={customSize}
            onCustomSizeChange={setCustomSize}
          />
        </>
      )}

      <div
        className="preview-frame mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white"
        style={{
          width: `${getDeviceSize().width}px`,
          height: `${getDeviceSize().height}px`,
        }}
      >
        <style>{themeCSS}</style>
        <div className="bio-page h-full overflow-y-auto p-6">
          {bioPage.avatarUrl && (
            <img
              src={bioPage.avatarUrl}
              alt={bioPage.title}
              className="bio-avatar w-24 h-24 mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{bioPage.title}</h1>
          {bioPage.description && (
            <p className="text-gray-600 mb-6">{bioPage.description}</p>
          )}
          <div className="space-y-3">
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="bio-link block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center">
                  {link.iconUrl && (
                    <img src={link.iconUrl} alt="" className="w-5 h-5 mr-3" />
                  )}
                  <span>{link.title}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Step 6: Analytics Tracking

### Step 6.1: Create Analytics Utilities

**File:** `lib/analytics/user-agent-parser.ts`

```typescript
interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'other';
  os: string;
}

export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/ipad|tablet|kindle|silk/i.test(ua)) {
    deviceType = 'tablet';
  }

  let browser: 'chrome' | 'firefox' | 'safari' | 'edge' | 'other' = 'other';
  if (/chrome|crios|crmo/i.test(ua) && !/edge|opr|edg/i.test(ua)) {
    browser = 'chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'firefox';
  } else if (
    /safari/i.test(ua) &&
    !/chrome|crios|crmo|edge|opr|edg/i.test(ua)
  ) {
    browser = 'safari';
  } else if (/edge|edg|opr/i.test(ua)) {
    browser = 'edge';
  }

  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac|macintosh/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  return { deviceType, browser, os };
}
```

**File:** `lib/analytics/ip-hasher.ts`

```typescript
import { createHash } from 'crypto';

export function hashIP(ipAddress: string): string {
  const hash = createHash('sha256');
  hash.update(ipAddress);
  return hash.digest('hex');
}
```

### Step 6.2: Create Client-Side Tracker

**File:** `lib/analytics/tracker.ts`

```typescript
interface ClickEvent {
  bioLinkId: string;
  bioPageId: string;
  url: string;
  timestamp: string;
  userAgent: string;
  referrer: string | null;
  screenWidth: number;
  screenHeight: number;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export class LinkTracker {
  private trackingEndpoint: string;
  private batchSize: number;
  private clickQueue: ClickEvent[] = [];
  private flushInterval: number;

  constructor(
    config: {
      trackingEndpoint?: string;
      batchSize?: number;
      flushInterval?: number;
    } = {}
  ) {
    this.trackingEndpoint = config.trackingEndpoint || '/api/v1/track-click';
    this.batchSize = config.batchSize || 10;
    this.flushInterval = config.flushInterval || 5000;
    this.setupBatchFlush();
  }

  trackClick(bioLinkId: string, bioPageId: string, url: string) {
    const clickEvent: ClickEvent = {
      bioLinkId,
      bioPageId,
      url,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      ...this.captureUTMParams(),
    };

    this.clickQueue.push(clickEvent);

    if (this.clickQueue.length >= this.batchSize) {
      this.flushQueue();
    }
  }

  private captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
    };
  }

  private setupBatchFlush() {
    setInterval(() => {
      if (this.clickQueue.length > 0) {
        this.flushQueue();
      }
    }, this.flushInterval);
  }

  private async flushQueue() {
    if (this.clickQueue.length === 0) return;

    const clicksToSend = [...this.clickQueue];
    this.clickQueue = [];

    try {
      await fetch(this.trackingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clicks: clicksToSend }),
        keepalive: true,
      });
    } catch (error) {
      console.error('Failed to track clicks:', error);
      this.clickQueue.unshift(...clicksToSend);
    }
  }

  trackAndNavigate(bioLinkId: string, bioPageId: string, url: string) {
    this.trackClick(bioLinkId, bioPageId, url);
    setTimeout(() => {
      window.location.href = url;
    }, 100);
  }
}

export const linkTracker = new LinkTracker();
```

---

## Step 7: Pages & Routing

### Step 7.1: Create Dashboard Group Structure

```bash
# Create the directory structure
mkdir -p app/\(dashboard\)/bio-pages/\[id\]
mkdir -p app/\(public\)/\[slug\]
```

### Step 7.2: Create Dashboard Layout

**File:** `app/(dashboard)/layout.tsx`

```typescript
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

### Step 7.3: Create Dashboard Home

**File:** `app/(dashboard)/page.tsx`

```typescript
import { BioPageList } from '@/components/bio-pages/bio-page-list';

export default function DashboardPage() {
  return <BioPageList />;
}
```

### Step 7.4: Create Bio Page Editor

**File:** `app/(dashboard)/bio-pages/[id]/page.tsx`

```typescript
'use client';

import { BioPageEditor } from '@/components/bio-pages/bio-page-editor';

export default function BioPageEditorPage({
  params,
}: {
  params: { id: string };
}) {
  return <BioPageEditor bioPageId={params.id} />;
}
```

### Step 7.5: Create Public Bio Page View

**File:** `app/(public)/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { generateThemeCSS } from '@/lib/theme/css-generator';

export default async function PublicBioPage({
  params,
}: {
  params: { slug: string };
}) {
  const bioPage = await db.query.bioPages.findFirst({
    where: and(eq(bioPages.slug, params.slug), eq(bioPages.isActive, true)),
    with: {
      links: true,
    },
  });

  if (!bioPage) {
    notFound();
  }

  const activeLinks = bioPage.links
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order);

  const themeCSS = generateThemeCSS(
    bioPage.themeConfig || {
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      secondaryTextColor: '#6b7280',
      fontFamily: 'Inter',
      fontSize: { base: '16px', heading: '24px', small: '14px' },
      fontWeight: { normal: 400, medium: 500, bold: 700 },
      spacing: 'normal',
      padding: { page: '24px', section: '16px', link: '12px' },
      layout: 'vertical',
      maxWidth: '600px',
      alignment: 'center',
      buttonStyle: 'solid',
      borderRadius: 8,
      borderWidth: 0,
      shadow: 'small',
      avatarShape: 'circle',
      avatarSize: 'medium',
      animation: 'fade',
      animationDuration: '0.3s',
      backgroundType: 'solid',
    }
  );

  return (
    <>
      <style>{themeCSS}</style>
      <div className="bio-page min-h-screen">
        {bioPage.avatarUrl && (
          <img
            src={bioPage.avatarUrl}
            alt={bioPage.title}
            className="bio-avatar w-24 h-24 mx-auto mb-4"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{bioPage.title}</h1>
        {bioPage.description && (
          <p className="text-gray-600 mb-6">{bioPage.description}</p>
        )}
        <div className="space-y-3">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              className="bio-link block"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center">
                {link.iconUrl && (
                  <img src={link.iconUrl} alt="" className="w-5 h-5 mr-3" />
                )}
                <span>{link.title}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
```

---

## Step 8: Testing

**Phase 8 - Testing (Complete):**

**Test Infrastructure:**

- Jest configuration (`jest.config.js`) - Unit and integration tests with Next.js integration
- Jest setup file (`jest.setup.js`) - Test environment setup with mocks
- Playwright configuration (`playwright.config.ts`) - E2E test configuration with multi-browser support

**Test Utilities:**

- Test data helpers (`tests/helpers/test-data.ts`) - Mock data generators for bio pages, links, themes, users, analytics
- Test render helpers (`tests/helpers/test-render.tsx`) - Custom render functions with providers
- API test helpers (`tests/helpers/api-helpers.ts`) - Mock request/response utilities

**Unit Tests:**

- Validation schemas (`tests/unit/lib/validations/`) - Comprehensive tests for all Zod schemas
  - `bio-page.test.ts` - Tests for bio page validation (title, slug, description, theme config, etc.)
  - `bio-link.test.ts` - Tests for bio link validation (URLs, order, theme config, reorder schema)
  - `theme-preset.test.ts` - Tests for theme preset validation
- Theme system (`tests/unit/lib/theme/`) - CSS generator and default themes tests
  - `css-generator.test.ts` - Tests for theme CSS generation with security sanitization
  - `default-themes.test.ts` - Tests for default theme configurations

**Integration Tests:**

- API routes (`tests/integration/api/`) - Tests for all API endpoints
  - `bio-pages.test.ts` - Tests for GET/POST/PUT/DELETE/PATCH bio pages endpoints

**E2E Tests:**

- Authentication flow (`tests/e2e/auth-flow.spec.ts`) - Complete auth flow testing
  - Sign in with valid/invalid credentials
  - Sign up with validation
  - Email verification
  - Password reset flow
  - Protected route redirects
  - Sign out functionality
- Bio page flow (`tests/e2e/bio-page-flow.spec.ts`) - Public bio page testing
  - Bio page display with avatar, title, description, links
  - Theme application (colors, buttons, layouts)
  - Analytics tracking
  - Responsive design
  - Accessibility testing

### Step 8.1: Test Configuration

**Files:**

- `jest.config.js` - Jest configuration for Next.js
- `jest.setup.js` - Jest setup with custom mocks
- `playwright.config.ts` - Playwright E2E test configuration

**Run Tests:**

```bash
# Unit and integration tests
bun run test                # Run all tests
bun run test:watch          # Watch mode
bun run test:coverage       # Coverage report

# E2E tests
bun run test:e2e            # Run E2E tests
bun run test:e2e:ui         # Run with Playwright UI
```

### Step 8.2: Test Coverage

Current test coverage includes:

- ✅ Validation schemas (bio-page, bio-link, theme-preset)
- ✅ Theme system (CSS generator, default themes)
- ✅ API routes (bio-pages CRUD operations)
- ✅ Authentication flow (sign-in, sign-up, verification, password reset)
- ✅ Public bio page (display, themes, analytics, accessibility)

### Step 8.3: Writing New Tests

When adding new tests, follow these patterns:

**Unit Test Example:**

```typescript
import { describe, expect, it } from '@jest/globals';
import { myFunction } from '@/lib/my-module';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });
});
```

**E2E Test Example:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page.getByText('content')).toBeVisible();
  });
});
```

---

## Step 9: Performance & Optimization

### Step 9.1: Add Code Splitting

**File:** `app/(dashboard)/bio-pages/page.tsx`

```typescript
import dynamic from 'next/dynamic';

const BioPageList = dynamic(
  () => import('@/components/bio-pages/bio-page-list'),
  { loading: () => <div>Loading...</div> }
);

export default function BioPagesPage() {
  return <BioPageList />;
}
```

---

## Step 10: Deployment & Launch

### Step 10.1: Environment Variables Setup

Create `.env.production`:

```env
DATABASE_TYPE=neon
DATABASE_URL=your_neon_connection_string
BETTER_AUTH_SECRET=your_production_secret
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 10.2: Build and Test

```bash
# Run production build
bun run build

# Test production build locally
bun run start

# Run tests
bun run test
bun run test:e2e
```

### Step 10.3: Deploy to Vercel

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel --prod
```

---

## Summary Checklist

**Current Progress: Phase 1 Complete ✅ | Phase 2 Complete ✅ | Phase 3 Complete ✅ | Phase 4 Complete ✅ | Phase 5 Complete ✅ | Phase 6 Complete ✅ | Phases 7-10 Not Started ⏸️**

Use this checklist to track your implementation progress:

### Phase 1: Database Foundation ✅ COMPLETE

- [x] Create database enums (`lib/db/schema/enums.ts`)
- [x] Create bio_pages table (`lib/db/schema/bio-pages.ts`)
- [x] Create bio_links table (`lib/db/schema/bio-links.ts`)
- [x] Create theme_presets table (`lib/db/schema/theme-presets.ts`)
- [x] Create link_analytics table (`lib/db/schema/link-analytics.ts`)
- [x] Create link_analytics_aggregates table (`lib/db/schema/link-analytics-aggregates.ts`)
- [x] Update schema exports (`lib/db/schema/index.ts`)
- [x] Create database relations (`lib/db/schema/bio-relations.ts`)
- [x] Run migrations (3 migration files created: `0000_`, `0001_`, `0002_`)

### Phase 2: Core API Development ✅ COMPLETE

- [x] Create validation schemas (`lib/validations/bio-page.ts`, `bio-link.ts`, `theme-preset.ts`)
- [x] Create API middleware (`lib/api/middleware.ts`)
- [x] Create Bio Pages API routes (`app/api/v1/bio-pages/route.ts`, `[id]/route.ts`, `toggle-visibility/route.ts`)
- [x] Create Bio Links API routes (`app/api/v1/bio-pages/[id]/links/route.ts`, `[id]/links/[linkId]/route.ts`, `reorder/route.ts`)
- [x] Create Theme Presets API routes (`app/api/v1/theme-presets/route.ts`, `[id]/route.ts`)
- [x] Create Analytics API routes (`app/api/v1/track-click/route.ts`)

### Phase 3: Theme System ✅ COMPLETE

- [x] Create theme types (`lib/theme/types.ts`)
- [x] Create theme CSS generator (`lib/theme/css-generator.ts`)
- [x] Create theme provider (`components/theme/theme-provider.tsx`)
- [x] Create default themes (`lib/theme/default-themes.ts`)
- [x] Create theme validator (`lib/theme/validator.ts`)

### Phase 4: Frontend Components ✅ COMPLETE

- [x] Create custom hooks (`lib/hooks/use-bio-pages.ts`, `use-bio-links.ts`)
- [x] Create dashboard layout (`components/layout/dashboard-layout.tsx`)
- [x] Create bio pages components (`components/bio-pages/`)
- [x] Create bio links components (`components/bio-links/`)
- [x] Create shared components

### Phase 5: Live Preview ✅ COMPLETE

- [x] Create live preview component (`components/theme/live-preview/live-preview.tsx`)
- [x] Create device selector (`components/theme/live-preview/device-selector.tsx`)
- [x] Create preview controls (`components/theme/live-preview/preview-controls.tsx`)
- [x] Create preview frame (`components/theme/live-preview/preview-frame.tsx`)
- [x] Create preview content (`components/theme/live-preview/preview-content.tsx`)
- [x] Create theme injector (`components/theme/live-preview/theme-injector.tsx`)

### Phase 6: Analytics Tracking ✅ COMPLETE

- [x] Create analytics utilities (`lib/analytics/user-agent-parser.ts`, `ip-hasher.ts`)
- [x] Create client-side tracker (`lib/analytics/tracker.ts`)
- [x] Create analytics API endpoint (`app/api/v1/track-click/route.ts`)

### Phase 7.3: Auth Pages 🆕

This section provides complete implementation guidance for authentication pages using **Better-Auth v1.4.10**.

#### Better-Auth Client Setup

**File:** `lib/auth/client.ts`

First, create a client instance for Better-Auth:

```typescript
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [],
});

// Type exports
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.User;
```

**File:** `app/api/auth/[...all]/route.ts`

Better-Auth API handler for Next.js App Router:

```typescript
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

---

#### 1. Sign In Page

**File:** `app/(auth)/sign-in/page.tsx`

```typescript
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      toast.success('Sign in successful! Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
```

**Commands:**

```bash
# Install sonner for toast notifications (if not installed)
bun add sonner

# Add ToastProvider to layout
# Update app/layout.tsx to include:
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
```

---

#### 2. Sign Up Page

**File:** `app/(auth)/sign-up/page.tsx`

```typescript
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/dashboard',
      });

      toast.success('Account created! Check your email for verification.');
      router.push('/sign-in');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign up to start creating your bio pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### 3. Email Verification Page

**File:** `app/(auth)/verify-email/page.tsx`

```typescript
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  React.useEffect(() => {
    async function verifyEmail() {
      if (!token) return;

      setVerifying(true);
      try {
        await authClient.verifyEmail({
          token,
        });

        setVerified(true);
        toast.success('Email verified successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to verify email.');
      } finally {
        setVerifying(false);
      }
    }

    verifyEmail();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Invalid Verification Link</CardTitle>
            <CardDescription>
              The verification link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {verifying
              ? 'Verifying your email address...'
              : verified
              ? 'Your email has been verified!'
              : 'Email verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {verifying ? (
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          ) : verified ? (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  You can now sign in to your account
                </p>
                <Button asChild className="w-full">
                  <Link href="/sign-in">Go to Sign In</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                The verification link may have expired. Please request a new verification email.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### 4. Forgot Password Page

**File:** `app/(auth)/forgot-password/page.tsx`

```typescript
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });

      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-in">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>
              <Button
                onClick={() => setSent(false)}
                variant="ghost"
                className="w-full"
              >
                Send Another Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### 5. Reset Password Page

**File:** `app/(auth)/reset-password/page.tsx`

```typescript
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword({
        token: token!,
        password,
      });

      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been reset. You can now sign in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <Button asChild className="w-full">
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 pl-10"
                  required
                  minLength={8}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### 6. Auth Layout

**File:** `app/(auth)/layout.tsx`

```typescript
import * as React from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (session) {
      window.location.href = '/dashboard';
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-6xl px-4">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">
                  B
                </span>
              </div>
              <span className="text-xl font-bold">BioLink Pro</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </header>

          <main className="flex flex-1 items-center justify-center">
            {children}
          </main>

          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BioLink Pro. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
```

---

#### 7. Dashboard Auth Guard

**File:** `app/(dashboard)/layout.tsx`

```typescript
import * as React from 'react';
import { redirect } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
```

---

#### Summary

**Files Created:**

- `lib/auth/client.ts` - Better-Auth client instance
- `app/api/auth/[...all]/route.ts` - Better-Auth API handler
- `app/(auth)/sign-in/page.tsx` - Sign in page
- `app/(auth)/sign-up/page.tsx` - Sign up page
- `app/(auth)/verify-email/page.tsx` - Email verification page
- `app/(auth)/forgot-password/page.tsx` - Forgot password page
- `app/(auth)/reset-password/page.tsx` - Reset password page
- `app/(auth)/layout.tsx` - Auth layout wrapper
- `app/(dashboard)/layout.tsx` - Dashboard auth guard

**Dependencies Added:**

- `sonner` - Toast notifications

**Key Features:**

- Email & password authentication
- Email verification
- Password reset flow
- Protected route middleware
- Session management with Better-Auth
- Responsive design with shadcn/ui components
- Loading states and error handling
- Toast notifications for user feedback

**Next Steps:**

1. Test all auth flows locally
2. Configure email service (Resend) in Better-Auth
3. Add social auth providers if needed (GitHub, Google)
4. Implement protected API routes
5. Add user profile settings page

---

### Phase 7: Pages & Routing ⏸️ NOT STARTED

- [ ] Create dashboard group structure (`app/(dashboard)/`)
- [ ] Create dashboard layout (`app/(dashboard)/layout.tsx`)
- [ ] Create dashboard home (`app/(dashboard)/page.tsx`)
- [ ] Create bio page editor (`app/(dashboard)/bio-pages/[id]/page.tsx`)
- [x] Create public bio page view (`app/[slug]/page.tsx`, `public-bio-page.tsx`)

### Phase 8: Testing ⏸️ NOT STARTED

- [ ] Create unit tests (`tests/unit/`)
- [ ] Create integration tests (`tests/integration/`)
- [ ] Create E2E tests (`tests/e2e/`)
- [ ] Run all tests

### Phase 9: Performance & Optimization ⏸️ NOT STARTED

- [ ] Add code splitting
- [ ] Implement caching
- [ ] Optimize images
- [ ] Add lazy loading

### Phase 10: Deployment & Launch ⏸️ NOT STARTED

- [ ] Set up production environment
- [ ] Run production build
- [ ] Deploy to production
- [ ] Monitor and verify

---

## Notes

1. **Always test database changes locally first** using `db:push` before creating migrations
2. **Keep API routes modular** - one file per route group
3. **Use TypeScript strict mode** for better type safety
4. **Follow the existing code style** in the project
5. **Run git hooks** to ensure code quality before committing
6. **Refer to the detailed documentation** in the `plans/` directory for more information

---

## Next Steps After Implementation

1. **Seed initial data** - Create default theme presets
2. **Set up monitoring** - Configure error tracking and analytics
3. **Write documentation** - Create user guides and API documentation
4. **Performance testing** - Load test the application
5. **Security audit** - Review and secure all endpoints

---

This implementation guide provides a comprehensive roadmap for building the bio-link management system. Follow each step carefully and test thoroughly before proceeding to the next phase.
