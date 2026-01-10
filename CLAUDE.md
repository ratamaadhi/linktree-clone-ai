# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SaaS Starter Kit** being evolved into a **Bio-Link Management System** (similar to Linktree but more advanced). The project is currently in the planning phase - the app directory still contains the default Next.js template.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, PostgreSQL, Drizzle ORM, Better-Auth, shadcn/ui, Bun package manager.

## Key Commands

### Development
```bash
bun run dev          # Start dev server
bun run build        # Build for production
bun run start        # Start production server
bun run analyze      # Bundle size analysis
```

### Database - Dual Workflow
**Local Development (Quick):**
```bash
bun run db:push      # Push schema directly (no migrations)
bun run db:studio    # Open Drizzle Studio
```

**Production (Migration-based):**
```bash
bun run db:generate  # Generate migration files
bun run db:migrate   # Run migrations
bun run db:migrate:prod  # Run to production
```

The database driver switches automatically based on `DATABASE_TYPE` env var:
- `local` → uses `postgres` package (postgres-js)
- `neon` → uses `@neondatabase/serverless`

### Testing & Quality
```bash
bun run test         # Unit tests (Jest)
bun run test:watch   # Watch mode
bun run test:e2e     # E2E tests (Playwright)
bun run lint         # ESLint
bun run format       # Prettier
bun run type-check   # TypeScript checks
```

### Test Database Connection
```bash
bun run db-scripts/test-db-connection.js
```

## Architecture

### Multi-Tenant SaaS Foundation
The starter kit provides:
- **Organizations** as tenants with role-based permissions (Owner/Admin/Member/Viewer)
- **Better-Auth** for authentication (email/password + OAuth)
- **Stripe** integration for subscriptions
- **Activity logging** for audit trails

### Database Driver Switching
The database connection in `lib/db/index.ts` automatically switches drivers based on `DATABASE_TYPE`:
- Local development uses connection pooling via `postgres-js`
- Production uses Neon's serverless HTTP driver

### Planned Bio-Link System
See `plans/` directory for comprehensive design documents. Key features:
- Multiple bio pages per user (not just one)
- Advanced theme system with JSONB storage
- Individual link styling
- Real-time analytics with aggregated tables
- Live preview functionality

**Schema to be implemented:** `bio_pages`, `bio_links`, `theme_presets`, `link_analytics`, `link_analytics_aggregates`

## Project Structure

```
app/                    # Next.js App Router
components/ui/          # shadcn/ui components
lib/
├── db/
│   ├── schema/         # Drizzle schema definitions
│   ├── migrations/     # Migration files (production)
│   └── index.ts        # DB connection with driver switching
├── auth.ts             # Better-Auth configuration
└── utils.ts            # cn() helper for Tailwind
plans/                  # Comprehensive project documentation
```

## Current Schema Tables

Existing SaaS starter tables (see `lib/db/schema/`):
- `user`, `session`, `account`, `verification` (Better-Auth)
- `organizations`, `organization_members` (multi-tenancy)
- `subscriptions` (Stripe billing)
- `invitations` (org invitations)
- `activity_logs` (audit trail)

## Important Patterns

### Theme Configuration
Themes use JSONB fields for flexible storage. The theme system is hierarchical:
1. Page-level theme (`bio_pages.theme_config`)
2. Link-level override (`bio_links.theme_config`)
3. CSS variable-based application

### Analytics Architecture
- Raw click events stored in `link_analytics`
- Pre-computed aggregations in `link_analytics_aggregates`
- Date-based indexes for efficient time-series queries

### Git Hooks
- **pre-commit:** Runs Prettier, ESLint, and tests (if test files exist)
- **pre-push:** Currently configured to ignore (see `.husky/pre-push`)

## Implementation Order

Follow the 18-week implementation plan in `plans/implementation-plan.md`:
1. Phase 1-2: Database and Core API
2. Phase 3: Theme System
3. Phase 4: Frontend Components
4. Phase 5: Live Preview
5. Phase 6: Analytics Tracking
6. Phase 7-10: Pages, Testing, Optimization, Launch

## When Working on This Project

1. Review `plans/` directory before making changes - the architecture is well-documented
2. Use `db:push` for local development, `db:generate` + `db:migrate` for production
3. The current database schema is for SaaS starter - bio-link schema needs implementation
4. Maintain the dual-driver database pattern for local/production
5. Git hooks will enforce code quality automatically
