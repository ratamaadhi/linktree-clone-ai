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
