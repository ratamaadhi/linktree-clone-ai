import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { organizations } from './organization';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'trialing',
]);

// Subscriptions table
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    stripeSubscriptionId: text('stripe_subscription_id').unique(),
    stripeCustomerId: text('stripe_customer_id'),
    status: subscriptionStatusEnum('status').notNull(),
    priceId: text('price_id'),
    currentPeriodStart: timestamp('current_period_start'),
    currentPeriodEnd: timestamp('current_period_end'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('subscriptions_org_id_idx').on(table.organizationId),
    index('subscriptions_stripe_sub_idx').on(table.stripeSubscriptionId),
  ]
);

export type Subscription = typeof subscriptions.$inferSelect;
