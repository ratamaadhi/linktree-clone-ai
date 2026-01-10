import { pgTable, uuid, date, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
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
