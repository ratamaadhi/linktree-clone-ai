import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';
import * as schema from '../lib/db/schema/index.js';

console.log('🔍 Verifying production database schema details...');

async function verifySchema() {
  try {
    // Read env values directly from file
    const fs = await import('fs');
    const path = await import('path');
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const envPath = path.join(__dirname, '../.env.production');
    const prodEnvContent = fs.default.readFileSync(envPath, 'utf-8');
    const prodEnv = {};
    prodEnvContent.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      if (key && value) {
        prodEnv[key.trim()] = value.replace(/"/g, '').trim();
      }
    });

    const dbType = prodEnv.DATABASE_TYPE || 'local';
    const dbUrl = prodEnv.DATABASE_URL || '';

    console.log(`📊 DATABASE_TYPE: ${dbType}`);
    console.log(`🔗 DATABASE_URL: ${dbUrl.replace(/:[^:]+@/, ':****@')}`);

    // Create db instance with production config
    const db =
      dbType === 'neon'
        ? drizzleNeon(neon(dbUrl), { schema })
        : drizzle(postgres(dbUrl, { max: 20 }), { schema });

    // Check invitations table columns (especially sender_id)
    const invitationsColumns = await db.execute(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'invitations'
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);

    const columnList = Array.isArray(invitationsColumns)
      ? invitationsColumns
      : invitationsColumns?.rows || [];

    console.log('\n📋 Invitations table columns:');
    columnList.forEach((col, index) => {
      const name = col.column_name || col?.column_name;
      const type = col.data_type || col?.data_type;
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`   ${index + 1}. ${name} (${type}) - ${nullable}`);
    });

    // Verify sender_id exists
    const hasSenderId = columnList.some(
      (col) => (col.column_name || col?.column_name) === 'sender_id'
    );

    console.log('\n📊 Schema Verification:');

    if (hasSenderId) {
      console.log('✅ sender_id column exists in invitations table');
    } else {
      console.log('❌ sender_id column missing in invitations table');
    }

    // Check foreign keys for invitations table
    const foreignKeys = await db.execute(`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'invitations';
    `);

    const fkList = Array.isArray(foreignKeys)
      ? foreignKeys
      : foreignKeys?.rows || [];

    console.log('\n📋 Invitations table foreign keys:');
    fkList.forEach((fk, index) => {
      const col = fk.column_name || fk?.column_name;
      const refTable = fk.foreign_table_name || fk?.foreign_table_name;
      const refCol = fk.foreign_column_name || fk?.foreign_column_name;
      console.log(`   ${index + 1}. ${col} → ${refTable}.${refCol}`);
    });

    // Check indexes on invitations table
    const indexes = await db.execute(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'invitations'
      AND schemaname = 'public'
      ORDER BY indexname;
    `);

    const indexList = Array.isArray(indexes) ? indexes : indexes?.rows || [];

    console.log('\n📋 Invitations table indexes:');
    indexList.forEach((idx, index) => {
      const name = idx.indexname || idx?.indexname;
      console.log(`   ${index + 1}. ${name}`);
    });

    console.log('\n✅ Production database schema verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Schema verification failed:');
    console.error(error);
    process.exit(1);
  }
}

verifySchema();
