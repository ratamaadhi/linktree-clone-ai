import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';

import * as schema from './schema';

const db =
  process.env.DATABASE_TYPE === 'neon'
    ? drizzleNeon(neon(process.env.DATABASE_URL!), { schema })
    : drizzle(postgres(process.env.DATABASE_URL!, { max: 20 }), { schema });

export { db, schema };
