import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, schema } from '@/lib/db/'; // your drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // PostgreSQL for both local and Neon
    schema: schema,
    usePlural: false, // Better-Auth expects singular table names
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 6, // 6 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    // Add social providers here when needed
    // github: {
    //     clientId: process.env.GITHUB_CLIENT_ID!,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },
});
