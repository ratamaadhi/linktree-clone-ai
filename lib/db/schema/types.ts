// Centralized TypeScript type exports for all schema tables
import type { activityLogs } from './activity';
import type { account, session, user, verification } from './auth';
import type { invitations } from './invitation';
import type { organizationMembers, organizations } from './organization';
import type { subscriptions } from './subscription';

// Select types
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Insert types for mutations
export type NewUser = typeof user.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type NewAccount = typeof account.$inferInsert;
export type NewVerification = typeof verification.$inferInsert;
export type NewOrganization = typeof organizations.$inferInsert;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type NewInvitation = typeof invitations.$inferInsert;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// Enums for type safety
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing';

// Relations types
export type UserWithOrganizations = User & {
  ownedOrganizations: Organization[];
  organizationMemberships: OrganizationMember[];
  sessions: Session[];
  accounts: Account[];
  verifications: Verification[];
  activityLogs: ActivityLog[];
  sentInvitations: Invitation[];
};

export type OrganizationWithMembers = Organization & {
  owner: User;
  members: (OrganizationMember & { user: User })[];
  subscriptions: Subscription[];
  invitations: Invitation[];
  activityLogs: ActivityLog[];
};
