import { relations } from 'drizzle-orm';
import { activityLogs } from './activity';
import { account, session, user, verification } from './auth';
import { invitations } from './invitation';
import { organizationMembers, organizations } from './organization';
import { subscriptions } from './subscription';

// User relations
export const userRelations = relations(user, ({ many }) => ({
  // Better-Auth relations
  sessions: many(session),
  accounts: many(account),
  verifications: many(verification),

  // SaaS relations
  ownedOrganizations: many(organizations, { relationName: 'owner' }),
  organizationMemberships: many(organizationMembers),
  activityLogs: many(activityLogs),
  sentInvitations: many(invitations),
}));

// Organization relations
export const organizationRelations = relations(
  organizations,
  ({ one, many }) => ({
    owner: one(user, {
      fields: [organizations.ownerId],
      references: [user.id],
      relationName: 'owner',
    }),
    members: many(organizationMembers),
    subscriptions: many(subscriptions),
    invitations: many(invitations),
    activityLogs: many(activityLogs),
  })
);

// Organization Member relations
export const organizationMemberRelations = relations(
  organizationMembers,
  ({ one }) => ({
    user: one(user, {
      fields: [organizationMembers.userId],
      references: [user.id],
    }),
    organization: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
  })
);

// Subscription relations
export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

// Invitation relations
export const invitationRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  sender: one(user, {
    fields: [invitations.senderId],
    references: [user.id],
    relationName: 'sentInvitations',
  }),
}));

// Activity Log relations
export const activityLogRelations = relations(activityLogs, ({ one }) => ({
  user: one(user, {
    fields: [activityLogs.userId],
    references: [user.id],
  }),
  organization: one(organizations, {
    fields: [activityLogs.organizationId],
    references: [organizations.id],
  }),
}));

// Better-Auth relations
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(user, {
    fields: [verification.identifier], // Using identifier instead of userId for email verification
    references: [user.email],
  }),
}));
