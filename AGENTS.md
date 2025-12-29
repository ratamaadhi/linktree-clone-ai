# Agent Guidelines for SaaS Starter Kit

This document provides coding conventions, commands, and guidelines for agentic coding assistants working in this repository.

## Build, Lint, and Test Commands

### Development

- `bun dev` - Start Next.js development server (http://localhost:3000)
- `bun build` - Build production bundle
- `bun start` - Start production server

### Code Quality

- `bun lint` - Run ESLint (runs automatically on pre-commit)
- `bun type-check` - Run TypeScript type checking (strict mode)
- `bun lint --fix` - Auto-fix linting issues

### Testing

- `bun test` - Run all Jest unit tests
- `bun test:watch` - Run tests in watch mode
- `bun test:coverage` - Generate test coverage report
- `bun test <path/to/test-file.test.ts>` - Run single test file
- `bun test -t "test name"` - Run tests matching pattern/name
- `bun test <path/to/test-file.test.ts> -t "test name"` - Run specific test in file
- `bun test:e2e` - Run Playwright E2E tests
- `bun test:e2e:ui` - Run E2E tests with Playwright UI

### Database

- `bun run db:generate` - Generate Drizzle migrations from schema changes
- `bun run db:migrate` - Apply migrations to database
- `bun run db:migrate:prod` - Apply migrations to production database
- `bun run db:push` - Push schema changes without migration file
- `bun run db:studio` - Open Drizzle Studio (database GUI)
- `bun run db:studio:prod` - Open Drizzle Studio for production
- `bun run db:drop` - Drop database tables

### Other

- `bun run analyze` - Analyze bundle size (requires ANALYZE=true)
- `bun prepare` - Initialize Husky git hooks (runs automatically after install)

## Code Style Guidelines

### TypeScript Configuration

- Strict mode enabled (`strict: true` in tsconfig.json)
- Target: ES2017
- Module resolution: bundler (modern)
- All TypeScript files must pass type checking before committing

### Import Style

- Use path alias `@/` for all imports from project root
- External imports first, then local imports
- Import React as `import * as React from "react"`
- Import groups: 1) external libraries, 2) @/ imports, 3) relative imports

Example:

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
```

### Component Guidelines

- Use React Server Components by default (no "use client" directive)
- Name components in PascalCase
- Export main component as default
- Export sub-components and types as named exports
- Use TypeScript interfaces for props, inline for simple components
- Use `cn()` utility from `@/lib/utils` for merging Tailwind classes

Example:

```typescript
function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}
export { Button, buttonVariants }
```

### shadcn/ui Components

- Components follow shadcn/ui "new-york" style
- Use class-variance-authority (cva) for component variants
- Support dark mode using CSS variables
- Data attributes for variant tracking (data-variant, data-size)
- Follow existing component patterns in components/ui/

### Styling (Tailwind CSS v4)

- Use Tailwind CSS v4 with CSS variables for theming
- All colors use semantic tokens (primary, secondary, muted, destructive)
- Dark mode supported via .dark class
- Use inline @theme in globals.css for custom theme values
- Prefer utility classes over custom CSS
- Use oklch color space for color definitions
- Design tokens: --radius: 0.625rem

### Database (Drizzle ORM)

- Schema files in lib/db/schema/
- Table names in PascalCase export, snake_case in database
- Column names in snake_case
- Use UUID primary keys with `.defaultRandom()`
- Add indexes for frequently queried fields
- Foreign keys with onDelete: 'cascade' for related data
- Export inferred types: `export type User = typeof users.$inferSelect`
- Use relations from lib/db/schema/relations.ts

Example:

```typescript
export const user = pgTable('user', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Naming Conventions

- **Variables/functions**: camelCase (e.g., userId, getUserData)
- **Components**: PascalCase (e.g., UserProfile, DashboardLayout)
- **Types/interfaces**: PascalCase (e.g., UserData, ApiResponse)
- **Enums**: PascalCase with PascalCase values (e.g., UserRole, Admin)
- **Database tables**: PascalCase export, snake_case actual (e.g., `user` table, `userRole` enum)
- **Database columns**: snake_case (e.g., created_at, email_verified)
- **Files**: kebab-case for utilities/pages, PascalCase for components

### Type Safety

- All functions must have explicit TypeScript types
- Use inferred types from Drizzle schemas where possible
- Export types that are reused across modules
- Use `zod` for runtime validation schemas
- Type assertions should be avoided; use type guards instead

### Error Handling

- Use try-catch for async operations
- Return meaningful error messages
- Use zod schemas for input validation
- Database errors should be caught and re-thrown with context
- API routes should return proper error responses with status codes

### File Organization

```
app/                    # Next.js App Router pages
components/ui/          # shadcn/ui components
components/             # Feature components
lib/                    # Utilities and configurations
lib/db/schema/         # Database schema definitions
lib/db/migrations/      # Database migration files
hooks/                  # Custom React hooks
types/                  # TypeScript type definitions
```

### Git Hooks (Husky)

- **pre-commit**: Runs `bun lint --fix && bun test` automatically
- **pre-push**: Runs `bun build` before pushing to remote
- Hooks are initialized automatically via `bun prepare`
- Use `git commit -m "... -n"` to skip hooks (not recommended)

### Testing Guidelines

- Unit tests with Jest + React Testing Library
- E2E tests with Playwright
- Test files: _.test.ts for Jest, _.spec.ts for E2E
- Tests should be co-located with source files or in tests/ directory
- Use describe/it/test patterns for test organization
- Mock external dependencies (API calls, database)
- Aim for meaningful test coverage

### Security

- Environment variables loaded from .env (not committed)
- Use process.env.DATABASE_URL! for required env vars
- Validate all user inputs with zod schemas
- Database queries use parameterized statements (Drizzle ORM)
- Never commit secrets or credentials

### Performance

- Use Next.js Image component for images
- Lazy load components and routes
- Use React.memo for expensive re-renders
- Optimize database queries with proper indexes
- Leverage Next.js caching strategies

### Authentication (Better-Auth)

- Configured in lib/auth.ts
- Email/password authentication enabled
- Session: 24 hour expiration, 6 hour update age
- Cookie cache: 5 minutes
- Email verification required
- Account linking enabled

### Package Manager

- Bun is the package manager (packageManager: "bun")
- Use `bun install` for dependencies
- Use `bun run <script>` or `bun <script>` for running scripts

## Before Making Changes

1. Run `bun type-check` to ensure no type errors
2. Run `bun lint` to check code quality
3. Run `bun test` to ensure tests pass
4. Check existing files for patterns before creating new ones
5. Follow the existing file structure and naming conventions

## After Making Changes

1. Run `bun lint --fix` to auto-fix linting issues
2. Run `bun type-check` to verify type safety
3. Run `bun test` to ensure tests pass
4. If database schema changed: run `bun run db:generate` to create migration
5. Test manually in development server

## Common Patterns

### Creating a new page

```typescript
export default function PageName() {
  return <div>Content</div>
}
```

### Creating a new component

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

function ComponentName({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("base-classes", className)} {...props} />
}
export { ComponentName }
```

### Database query

```typescript
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

const users = await db.select().from(user);
```

### API route

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: 'value' });
}
```

## Notes

- This is a Next.js 15++ SaaS starter with App Router
- TypeScript strict mode is enforced
- All code must be typed and pass linting
- Database is PostgreSQL (local or Neon)
- Multi-tenant architecture with organizations
- Role-based access control
- Stripe integration for billing
