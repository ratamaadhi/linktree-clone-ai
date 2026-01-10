// Export schema tables and enums
export { user, session, account, verification } from './auth';
export {
  organizations,
  organizationMembers,
  userRoleEnum,
} from './organization';
export { subscriptions, subscriptionStatusEnum } from './subscription';
export { invitations } from './invitation';
export { activityLogs } from './activity';

// Bio-link system schemas
export * from './enums';
export { bioPages } from './bio-pages';
export { bioLinks } from './bio-links';
export { themePresets } from './theme-presets';
export { linkAnalytics } from './link-analytics';
export { linkAnalyticsAggregates } from './link-analytics-aggregates';

// Export relations
export {
  userRelations,
  organizationRelations,
  organizationMemberRelations,
  subscriptionRelations,
  invitationRelations,
  activityLogRelations,
  sessionRelations,
  accountRelations,
  verificationRelations,
} from './relations';

// Export bio-link system relations
export {
  bioPagesRelations,
  bioLinksRelations,
  themePresetsRelations,
  linkAnalyticsRelations,
  linkAnalyticsAggregatesRelations,
} from './bio-relations';

// Export types
export type * from './types';
