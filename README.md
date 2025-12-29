# SaaS Starter Kit - Next.js 15

A comprehensive, production-ready SaaS Starter Kit built with Next.js 15, featuring multi-tenancy, authentication, billing, analytics, and all the essential components you need to launch your SaaS application quickly.

## 🚀 Features

### Core Features

- **Next.js 15** with App Router for optimal performance
- **Multi-tenant Architecture** with organization management
- **Better-Auth** for secure authentication (email/password, social login)
- **Role-Based Permissions** (Owner, Admin, Member, Viewer)
- **Stripe Billing Integration** with subscription management
- **Dashboard Analytics** with real-time metrics
- **Activity Logging** for comprehensive audit trails
- **Email Notifications** with Resend and React Email
- **Dark Mode Support** with system preference detection
- **Responsive Design** optimized for mobile and desktop

### Technical Features

- **TypeScript** for type safety
- **Tailwind CSS v4** for modern styling
- **Drizzle ORM** with PostgreSQL
- **Neon Database** support for serverless production
- **Driver Switching** (postgres-js for local, neon-http for production)
- **shadcn/ui** component library
- **API Rate Limiting** with Upstash Redis
- **Security Best Practices** (CSRF, XSS protection)
- **Comprehensive Testing** (Jest, Playwright)
- **CI/CD Workflows** with GitHub Actions

## 📋 Prerequisites

- Bun package manager
- Node.js 20+
- PostgreSQL 15+ (local) or Neon (production)
- Stripe account (for billing)
- Resend account (for emails)

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd next15-starter-template
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Database Type (local or neon)
DATABASE_TYPE="local"

# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/saas_starter_kit"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Resend
RESEND_API_KEY="re_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# Development
NODE_ENV="development"
```

### 3. Database Setup

The project uses Drizzle ORM with two database connection strategies:

**For Local Development (Quick):**

```bash
# Push schema directly to database (no migration files)
bun run db:push
```

**For Production (Migration-Based):**

```bash
# Generate migration files from schema changes
bun run db:generate

# Run migrations to database
bun run db:migrate
```

**Seed database with sample data:**

```bash
bun run db:seed
```

### 4. Verify Environment

Before starting development, verify your environment is configured correctly:

```bash
# Test database connection
bun run db-scripts/test-db-connection.js
```

This will check:

- ✅ Database connection status
- ✅ Database type (local/neon)
- ✅ All required tables exist

If any check fails, review your `.env` configuration and ensure your database is running.

### 5. Start Development

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### 5. Test Database Connection

```bash
bun run db-scripts/test-db-connection.js
```

This will verify that your database is properly configured.

## 📁 Project Structure

```
next15-starter-template/
├── app/                          # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility libraries
│   ├── db/                       # Database configuration
│   │   ├── schema/               # Drizzle schema definitions
│   │   │   ├── index.ts
│   │   │   ├── relations.ts
│   │   │   ├── auth.ts
│   │   │   ├── organization.ts
│   │   │   ├── subscription.ts
│   │   │   ├── invitation.ts
│   │   │   └── activity.ts
│   │   ├── migrations/           # Database migration files
│   │   └── index.ts             # Database connection with driver switching
│   ├── auth.ts                   # Better-Auth configuration
│   ├── utils.ts                  # General utilities
│   └── db.ts                    # Legacy database file (may be deprecated)
├── docs/                         # Documentation
│   ├── 1. architecture-summary.md
│   ├── 2. saas-starter-architecture.md
│   ├── 3. implementation-plan.md
│   ├── 4. component-structure.md
│   └── 5. testing-deployment-plan.md
├── .env                         # Development environment variables
├── .env.example                 # Environment template
├── .env.production              # Production environment variables
├── drizzle.config.ts            # Drizzle Kit configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🏗️ Architecture

### Multi-Tenant Design

The application is built with a multi-tenant architecture where each organization has its own isolated data space. Key components:

- **Organizations**: Central tenant management
- **Members**: User management with role-based permissions
- **Subscriptions**: Billing and plan management
- **Activity Logs**: Comprehensive audit trails

### Authentication Flow

1. **Registration**: Users can register with email/password or social providers
2. **Organization Creation**: Users can create or join organizations
3. **Role Assignment**: Members are assigned roles with specific permissions
4. **Session Management**: Secure sessions with automatic renewal

### Billing Integration

- **Stripe Checkout**: Secure payment processing
- **Subscription Management**: Automated billing cycles
- **Webhook Handling**: Real-time payment event processing
- **Plan Management**: Flexible pricing tiers

## 🔧 Development

### Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server

# Database - Local Development
bun run db:push         # Push schema directly (quick, no migration files)
bun run db:generate     # Generate migration files from schema changes
bun run db:migrate      # Run migrations to database
bun run db:studio       # Open Drizzle Studio (connects to .env)
bun run db:seed         # Seed database with sample data
bun run db:drop         # Drop database schema

# Database - Production
bun run db:studio:prod  # Open Drizzle Studio (connects to .env.production)
bun run db:migrate:prod  # Run migrations to production database
bun run db:push:prod     # Push schema to production database

# Testing
bun run test             # Run all tests
bun run test:watch       # Run tests in watch mode
bun run test:coverage    # Run tests with coverage
bun run test:e2e         # Run E2E tests
bun run test:e2e:ui      # Run E2E tests with UI

# Code Quality
bun run lint            # Run ESLint
bun run type-check      # Run TypeScript checks

# Analysis
bun run analyze         # Analyze bundle size
```

### Database Workflow

The project uses Drizzle ORM with two different workflows depending on the environment:

#### Local Development (Quick Workflow)

Use `db:push` for rapid development:

```bash
# 1. Make schema changes in lib/db/schema/
# 2. Push directly to database
bun run db:push
# Done! No migration files created
```

**Benefits:**

- ✅ Fast (1 command)
- ✅ No migration files to manage
- ✅ Ideal for local development

#### Production (Migration-Based Workflow)

Use `db:generate` + `db:migrate` for production:

```bash
# 1. Make schema changes in lib/db/schema/
# 2. Generate migration file
bun run db:generate

# 3. Review migration in lib/db/migrations/
# 4. Run migration to production
bun run db:migrate:prod

# 5. Commit migration file to git
git add lib/db/migrations/xxxx_migration.sql
```

**Benefits:**

- ✅ Schema version control
- ✅ Rollback capability
- ✅ Team collaboration
- ✅ Production-safe

### Database Drivers

The project automatically switches database drivers based on `DATABASE_TYPE`:

| DATABASE_TYPE | Driver        | Package                    | Best For                                  |
| ------------- | ------------- | -------------------------- | ----------------------------------------- |
| `local`       | `postgres-js` | `postgres`                 | Local development with connection pooling |
| `neon`        | `neon-http`   | `@neondatabase/serverless` | Production on Neon serverless             |

**Configuration:**

**`.env` (Development):**

```env
DATABASE_TYPE="local"
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

**`.env.production`:**

```env
DATABASE_TYPE="neon"
DATABASE_URL="postgres://user:pass@ep-xxx.us-east-2.aws.neon.tech/db?sslmode=require"
```

### Environment Files

- **`.env`** - Development environment (local database)
- **`.env.production`** - Production environment (Neon database)
- **`.env.example`** - Template with all required variables

**Important:** Never commit `.env` or `.env.production` to version control.

### Database Schema

The application uses PostgreSQL with following main tables:

- **user**: User accounts and profiles (Better-Auth)
- **session**: User sessions (Better-Auth)
- **account**: OAuth provider accounts (Better-Auth)
- **verification**: Email verification tokens (Better-Auth)
- **organizations**: Tenant organizations
- **organization_members**: User-organization relationships with roles
- **subscriptions**: Billing subscriptions
- **invitations**: Organization invitations with sender tracking
- **activity_logs**: Audit trail

**Schema Files Location:** `lib/db/schema/`

**Complete Schema:**

- `lib/db/schema/auth.ts` - Better-Auth tables
- `lib/db/schema/organization.ts` - Organization and members
- `lib/db/schema/subscription.ts` - Billing subscriptions
- `lib/db/schema/invitation.ts` - Invitation system
- `lib/db/schema/activity.ts` - Activity logging
- `lib/db/schema/relations.ts` - Database relationships
- `lib/db/schema/index.ts` - Schema exports

**Database Relations:**

- User ↔ OrganizationMembers (one-to-many)
- User ↔ Invitations (one-to-many as sender)
- User ↔ Sessions/Accounts/Verifications (one-to-many)
- Organization ↔ Members/Subscriptions/Invitations/ActivityLogs (one-to-many)
- OrganizationMembers ↔ User/Organization (many-to-one)

### Drizzle Studio

View and manage your database visually:

```bash
# Local development database
bun run db:studio

# Production database
bun run db:studio:prod
```

Open your browser to `https://local.drizzle.studio` to access the database manager.

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

### E2E Testing

```bash
# Run E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui
```

### Code Quality

```bash
# Run ESLint
bun run lint

# Run TypeScript checks
bun run type-check
```

## 🚀 Deployment

### Production Database Setup

1. **Configure Production Environment:**

   ```bash
   # Edit .env.production with your Neon database URL
   DATABASE_TYPE="neon"
   DATABASE_URL="postgres://user:pass@ep-xxx.us-east-2.aws.neon.tech/db?sslmode=require"
   ```

2. **Run Database Migrations:**

   ```bash
   # Generate migration files (if schema changed)
   bun run db:generate

   # Apply migrations to production database
   bun run db:migrate:prod
   ```

3. **Verify Production Database:**
   ```bash
   # Test connection
   bun run db:studio:prod
   ```

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `DATABASE_TYPE=neon`
   - `DATABASE_URL=your-neon-connection-string`
   - `BETTER_AUTH_SECRET=your-production-secret`
   - `BETTER_AUTH_URL=your-production-url`
   - All other required variables from `.env.example`
3. Deploy automatically on push to main branch

### Environment Variables in Production

Make sure to set these in your deployment platform:

```env
# Database Type
DATABASE_TYPE="neon"

# Database Connection
DATABASE_URL="postgres://user:pass@ep-xxx.us-east-2.aws.neon.tech/db?sslmode=require"

# Authentication
BETTER_AUTH_SECRET="your-production-secret"
BETTER_AUTH_URL="https://your-production-domain.com"

# Stripe Production Keys
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Resend Production Key
RESEND_API_KEY="re_your-production-key"

# Application
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"
NEXTAUTH_URL="https://your-production-domain.com"
```

### Docker Deployment (Optional)

```bash
# Build and run with Docker
docker build -t saas-starter-kit .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e BETTER_AUTH_SECRET="your-secret" \
  saas-starter-kit
```

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## 🔐 Security

### Implemented Security Measures

- **Authentication**: Secure session management with Better-Auth
- **Authorization**: Role-based access control
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: API endpoint protection with Upstash Redis
- **Secure Headers**: Security-focused HTTP headers

### Environment Variables

Keep sensitive data in environment variables and never commit them to version control:

- Database credentials
- API keys (Stripe, Resend, etc.)
- Authentication secrets
- External service URLs

## 📊 Monitoring

### Health Checks

Monitor application health with the built-in health check endpoint:

```bash
curl http://localhost:3000/api/health
```

### Error Tracking

The application includes error tracking configuration for production environments.

### Performance Monitoring

Built-in performance monitoring with:

- Core Web Vitals tracking
- API response time monitoring
- Database query performance
- Bundle size analysis

## 📚 Documentation

- [Architecture Summary](docs/1. architecture-summary.md)
- [SaaS Starter Architecture](docs/2. saas-starter-architecture.md)
- [Implementation Plan](docs/3. implementation-plan.md)
- [Component Structure](docs/4. component-structure.md)
- [Testing and Deployment Plan](docs/5. testing-deployment-plan.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](docs/)
2. Search existing [GitHub Issues](../../issues)
3. Create a new issue with detailed information

## 🗺️ Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Advanced role customization
- [ ] API documentation generation
- [ ] Mobile app templates
- [ ] Advanced billing features (usage-based billing)
- [ ] Integration marketplace
- [ ] Advanced security features (2FA, SSO)

## 🌟 Show Your Support

If this project helped you build your SaaS application, please give it a ⭐ on GitHub!

---

**Built with ❤️ using Next.js 15, TypeScript, and modern web technologies**
