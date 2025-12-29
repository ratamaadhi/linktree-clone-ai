import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

const envFile =
  process.env.DB_ENV === 'production' ? '.env.production' : '.env';
config({ path: envFile });

export default defineConfig({
  schema: './lib/db/schema/index.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
});
