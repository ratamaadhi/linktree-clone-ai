# Database Scripts

This directory contains utility scripts for database management and testing.

## Available Scripts

### `test-db-connection.js`

Test database connection and list all tables in the database.

**Usage:**

```bash
bun run db-scripts/test-db-connection.js
```

**What it does:**

- ✅ Tests database connection
- ✅ Shows database type (local/neon)
- ✅ Lists all tables in the database
- ✅ Displays current database time

**Environment:** Uses `.env` file (local development)

---

### `check-prod-db.js`

Check production database for required tables and schema completeness.

**Usage:**

```bash
bun run db-scripts/check-prod-db.js
```

**What it does:**

- ✅ Connects to production database (Neon)
- ✅ Lists all tables in production
- ✅ Verifies all expected tables are present
- ✅ Identifies missing tables
- ✅ Shows extra tables

**Expected tables:**

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts
- `verification` - Email verification
- `organizations` - Organization tenants
- `organization_members` - User-org relationships
- `subscriptions` - Billing subscriptions
- `invitations` - Organization invitations
- `activity_logs` - Audit trails

**Environment:** Uses `.env.production` file

---

### `verify-prod-schema.js`

Detailed verification of production database schema, especially for `invitations` table.

**Usage:**

```bash
bun run db-scripts/verify-prod-schema.js
```

**What it does:**

- ✅ Verifies all columns in `invitations` table
- ✅ Checks for `sender_id` column
- ✅ Lists all foreign keys on `invitations` table
- ✅ Shows all indexes on `invitations` table
- ✅ Validates schema completeness

**Key checks:**

- `sender_id` column exists and is NOT NULL
- Foreign keys: `organization_id` → `organizations`, `sender_id` → `user`
- Indexes: `token`, `email`, `sender_id`

**Environment:** Uses `.env.production` file

---

## Quick Reference

| Script                  | Environment       | Purpose                                 |
| ----------------------- | ----------------- | --------------------------------------- |
| `test-db-connection.js` | `.env` (Local)    | Quick connection test for development   |
| `check-prod-db.js`      | `.env.production` | Production database tables check        |
| `verify-prod-schema.js` | `.env.production` | Detailed production schema verification |

---

## Common Workflows

### Before Development

```bash
# Test local database connection
bun run db-scripts/test-db-connection.js
```

### Before Production Deployment

```bash
# Check production database tables
bun run db-scripts/check-prod-db.js

# Verify production schema details
bun run db-scripts/verify-prod-schema.js
```

### After Database Changes

```bash
# For local development
bun run db:push
bun run db-scripts/test-db-connection.js

# For production
bun run db:migrate:prod
bun run db-scripts/check-prod-db.js
```

---

## Troubleshooting

### Connection Errors

**Local Development:**

```bash
# Make sure Postgres.app is running
# Check DATABASE_URL in .env
bun run db-scripts/test-db-connection.js
```

**Production:**

```bash
# Verify Neon database is active
# Check DATABASE_URL in .env.production
bun run db-scripts/check-prod-db.js
```

### Missing Tables

If `check-prod-db.js` shows missing tables:

```bash
# Run migrations to production
bun run db:migrate:prod

# Or push schema directly
bun run db:push:prod
```

### Schema Issues

If `verify-prod-schema.js` shows schema problems:

```bash
# Check migration files
ls -lh lib/db/migrations/

# Re-run migrations
bun run db:migrate:prod
```

---

## Notes

- All scripts use Drizzle ORM with automatic driver switching (postgres-js for local, neon-http for production)
- Scripts automatically handle environment loading from correct `.env` files
- All scripts exit with appropriate exit codes (0 for success, 1 for failure)
- Scripts hide sensitive information (passwords in DATABASE_URL)
