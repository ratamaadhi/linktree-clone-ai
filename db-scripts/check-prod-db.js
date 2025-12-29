import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';
import { neon } from '@neondatabase/serverless';
import * as schema from '../lib/db/schema/index.js';

console.log('🔍 Testing PRODUCTION database connection...');

async function testConnection() {
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

    const result = await db.execute('SELECT NOW() as current_time');
    console.log('✅ Production database connected!');

    const time = Array.isArray(result)
      ? result[0]?.current_time
      : result?.rows?.[0]?.current_time || result?.[0]?.current_time;
    console.log(`🕐 Current database time: ${time}`);

    // Check schema existence
    const tables = await db.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tableList = Array.isArray(tables) ? tables : tables?.rows || [];
    console.log(`\n📋 Production database tables (${tableList.length}):`);

    // Expected tables based on schema
    const expectedTables = [
      'user',
      'session',
      'account',
      'verification',
      'organizations',
      'organization_members',
      'subscriptions',
      'invitations',
      'activity_logs',
    ];

    tableList.forEach((table, index) => {
      const tableName = table.table_name || table?.table_name;
      const isExpected = expectedTables.includes(tableName);
      const icon = isExpected ? '✅' : '❓';
      console.log(`   ${icon} ${index + 1}. ${tableName}`);
    });

    // Check for missing tables
    const tableNames = tableList.map((t) => t.table_name || t?.table_name);
    const missingTables = expectedTables.filter(
      (table) => !tableNames.includes(table)
    );

    console.log('\n📊 Analysis:');
    if (missingTables.length === 0) {
      console.log('✅ All expected tables are present in production database!');
      console.log('✅ Production database schema is up to date!');
    } else {
      console.log(
        `❌ Missing tables in production: ${missingTables.join(', ')}`
      );
      console.log(`💡 Run: DB_ENV=production bun run db:push:prod`);
    }

    // Check for extra tables
    const extraTables = tableNames.filter(
      (table) => !expectedTables.includes(table)
    );
    if (extraTables.length > 0) {
      console.log(`⚠️  Extra tables found: ${extraTables.join(', ')}`);
    }

    console.log('\n✅ Production database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Production database connection failed:');
    console.error(error);
    console.error('\n💡 Tips:');
    console.error('  1. Check DATABASE_URL in .env.production');
    console.error('  2. Verify Neon database is active');
    console.error('  3. Check SSL certificate');
    console.error(
      '  4. Ensure .env.production exists and is properly formatted'
    );
    process.exit(1);
  }
}

testConnection();
