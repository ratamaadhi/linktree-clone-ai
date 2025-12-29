import { db } from '../lib/db';

console.log('🔍 Testing database connection...');

async function testConnection() {
  try {
    console.log(`📊 DATABASE_TYPE: ${process.env.DATABASE_TYPE}`);
    console.log(
      `🔗 DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@')}`
    );

    const result = await db.execute('SELECT NOW() as current_time');
    console.log('✅ Database connected!');

    // Handle different driver response formats
    const time = Array.isArray(result)
      ? result[0]?.current_time
      : result?.rows?.[0]?.current_time || result?.[0]?.current_time;
    console.log(`🕐 Current database time: ${time}`);

    // Test schema existence
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const tableList = Array.isArray(tables) ? tables : tables?.rows || [];
    console.log(`📋 Existing tables (${tableList.length}):`);
    tableList.forEach((table, index) => {
      const tableName = table.table_name || table?.table_name;
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log('✅ Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    console.error('\n💡 Tips:');
    if (process.env.DATABASE_TYPE === 'local') {
      console.error('  1. Make sure Postgres.app is running');
      console.error('  2. Check DATABASE_URL in .env');
      console.error('  3. Verify database exists');
    } else if (process.env.DATABASE_TYPE === 'neon') {
      console.error('  1. Check DATABASE_URL in .env.production');
      console.error('  2. Verify Neon database is active');
      console.error('  3. Check SSL certificate');
    }
    process.exit(1);
  }
}

testConnection();
