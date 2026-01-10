# API Routes Architecture - Bio-Link Management System

## Overview

This document outlines the RESTful API architecture for the bio-link management application, including all CRUD operations, authentication, and authorization patterns.

## Base URL Structure

```
/api/v1/
```

## Authentication & Authorization

### Middleware Pattern

All API routes (except public bio page views) require authentication using Better-Auth session validation.

```typescript
// lib/api/middleware.ts
export async function requireAuth(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

export async function requireOrgAccess(request: Request, orgId: string) {
  const session = await requireAuth(request);
  // Check if user has access to organization
  const member = await db.query.organizationMembers.findFirst({
    where: and(
      eq(organizationMembers.userId, session.user.id),
      eq(organizationMembers.organizationId, orgId)
    )
  });
  if (!member) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { session, member };
}
```

## API Endpoints

### 1. Bio Pages Management

#### GET /api/v1/bio-pages

List all bio pages for the authenticated user.

**Query Parameters:**

- `organizationId` (optional): Filter by organization
- `isActive` (optional): Filter by active status
- `page` (optional): Pagination page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "My Profile",
      "slug": "my-profile",
      "description": "Personal links",
      "avatarUrl": "https://...",
      "isActive": true,
      "publishedAt": "2024-01-01T00:00:00Z",
      "themeConfig": { ... },
      "themePresetId": "uuid",
      "linksCount": 5,
      "totalClicks": 1234,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

#### POST /api/v1/bio-pages

Create a new bio page.

**Request Body:**

```json
{
  "title": "My Profile",
  "slug": "my-profile",
  "description": "Personal links",
  "avatarUrl": "https://...",
  "isActive": true,
  "themeConfig": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#8b5cf6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter",
    "buttonStyle": "solid",
    "borderRadius": 8,
    "spacing": "normal",
    "layout": "vertical"
  },
  "themePresetId": "uuid"
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "title": "My Profile",
    "slug": "my-profile",
    "description": "Personal links",
    "avatarUrl": "https://...",
    "isActive": true,
    "publishedAt": null,
    "themeConfig": { ... },
    "themePresetId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/v1/bio-pages/:id

Get a specific bio page by ID.

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "organizationId": "uuid",
    "title": "My Profile",
    "slug": "my-profile",
    "description": "Personal links",
    "avatarUrl": "https://...",
    "isActive": true,
    "publishedAt": "2024-01-01T00:00:00Z",
    "themeConfig": { ... },
    "themePresetId": "uuid",
    "links": [
      {
        "id": "uuid",
        "title": "Twitter",
        "url": "https://twitter.com/user",
        "description": "Follow me on Twitter",
        "iconUrl": "https://...",
        "imageUrl": "https://...",
        "isActive": true,
        "order": 0,
        "themeConfig": { ... },
        "clicksCount": 456,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/v1/bio-pages/:id

Update a bio page.

**Request Body:**

```json
{
  "title": "Updated Profile",
  "slug": "updated-profile",
  "description": "Updated description",
  "avatarUrl": "https://...",
  "isActive": true,
  "themeConfig": { ... },
  "themePresetId": "uuid"
}
```

**Response:** Same as GET /api/v1/bio-pages/:id

#### DELETE /api/v1/bio-pages/:id

Delete a bio page (cascades to links and analytics).

**Response:**

```json
{
  "message": "Bio page deleted successfully"
}
```

#### PATCH /api/v1/bio-pages/:id/toggle-visibility

Toggle active/inactive status of a bio page.

**Request Body:**

```json
{
  "isActive": false
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "isActive": false,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Bio Links Management

#### GET /api/v1/bio-pages/:pageId/links

List all links for a specific bio page.

**Query Parameters:**

- `isActive` (optional): Filter by active status
- `sortBy` (optional): Sort by field (default: 'order')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'asc')

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "bioPageId": "uuid",
      "title": "Twitter",
      "url": "https://twitter.com/user",
      "description": "Follow me on Twitter",
      "iconUrl": "https://...",
      "imageUrl": "https://...",
      "isActive": true,
      "order": 0,
      "themeConfig": { ... },
      "clicksCount": 456,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/bio-pages/:pageId/links

Create a new link in a bio page.

**Request Body:**

```json
{
  "title": "Twitter",
  "url": "https://twitter.com/user",
  "description": "Follow me on Twitter",
  "iconUrl": "https://...",
  "imageUrl": "https://...",
  "isActive": true,
  "order": 0,
  "themeConfig": {
    "backgroundColor": "#3b82f6",
    "textColor": "#ffffff",
    "buttonStyle": "solid",
    "borderRadius": 8
  }
}
```

**Response:** Same as GET /api/v1/bio-pages/:pageId/links

#### PUT /api/v1/bio-pages/:pageId/links/:linkId

Update a specific link.

**Request Body:** Same as POST /api/v1/bio-pages/:pageId/links

**Response:** Same as GET /api/v1/bio-pages/:pageId/links

#### DELETE /api/v1/bio-pages/:pageId/links/:linkId

Delete a link (cascades to analytics).

**Response:**

```json
{
  "message": "Link deleted successfully"
}
```

#### PATCH /api/v1/bio-pages/:pageId/links/:linkId/toggle-visibility

Toggle active/inactive status of a link.

**Request Body:**

```json
{
  "isActive": false
}
```

**Response:** Same as GET /api/v1/bio-pages/:pageId/links

#### POST /api/v1/bio-pages/:pageId/links/reorder

Reorder links in bulk.

**Request Body:**

```json
{
  "links": [
    { "id": "uuid", "order": 0 },
    { "id": "uuid", "order": 1 },
    { "id": "uuid", "order": 2 }
  ]
}
```

**Response:**

```json
{
  "message": "Links reordered successfully",
  "data": [
    { "id": "uuid", "order": 0 },
    { "id": "uuid", "order": 1 },
    { "id": "uuid", "order": 2 }
  ]
}
```

### 3. Theme Presets Management

#### GET /api/v1/theme-presets

List all theme presets for the authenticated user.

**Query Parameters:**

- `organizationId` (optional): Filter by organization
- `isSystemPreset` (optional): Filter system presets
- `page` (optional): Pagination page number
- `limit` (optional): Items per page

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "organizationId": "uuid",
      "name": "Modern Blue",
      "description": "Clean blue theme",
      "thumbnailUrl": "https://...",
      "themeConfig": { ... },
      "isSystemPreset": false,
      "usageCount": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### POST /api/v1/theme-presets

Create a new theme preset.

**Request Body:**

```json
{
  "name": "Modern Blue",
  "description": "Clean blue theme",
  "thumbnailUrl": "https://...",
  "themeConfig": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#8b5cf6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter",
    "buttonStyle": "solid",
    "borderRadius": 8,
    "spacing": "normal",
    "layout": "vertical"
  }
}
```

**Response:** Same as GET /api/v1/theme-presets

#### GET /api/v1/theme-presets/:id

Get a specific theme preset.

**Response:** Same as GET /api/v1/theme-presets

#### PUT /api/v1/theme-presets/:id

Update a theme preset.

**Request Body:** Same as POST /api/v1/theme-presets

**Response:** Same as GET /api/v1/theme-presets

#### DELETE /api/v1/theme-presets/:id

Delete a theme preset (unless it's a system preset).

**Response:**

```json
{
  "message": "Theme preset deleted successfully"
}
```

#### POST /api/v1/theme-presets/:id/duplicate

Duplicate a theme preset.

**Response:**

```json
{
  "data": {
    "id": "new-uuid",
    "name": "Modern Blue (Copy)",
    "description": "Clean blue theme",
    "thumbnailUrl": "https://...",
    "themeConfig": { ... },
    "isSystemPreset": false,
    "usageCount": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Analytics Management

#### GET /api/v1/bio-pages/:pageId/analytics

Get analytics summary for a bio page.

**Query Parameters:**

- `startDate` (optional): Start date (ISO 8601 format)
- `endDate` (optional): End date (ISO 8601 format)
- `groupBy` (optional): 'day', 'week', 'month' (default: 'day')

**Response:**

```json
{
  "data": {
    "totalClicks": 1234,
    "uniqueClicks": 987,
    "topLinks": [
      {
        "id": "uuid",
        "title": "Twitter",
        "clicks": 456,
        "percentage": 36.9
      }
    ],
    "deviceBreakdown": {
      "desktop": 567,
      "mobile": 543,
      "tablet": 124
    },
    "topCountries": {
      "US": 234,
      "ID": 189,
      "GB": 123
    },
    "topReferrers": [
      {
        "referrer": "https://twitter.com",
        "clicks": 123
      }
    ],
    "timeline": [
      {
        "date": "2024-01-01",
        "clicks": 123,
        "uniqueClicks": 98
      }
    ]
  }
}
```

#### GET /api/v1/bio-pages/:pageId/links/:linkId/analytics

Get analytics for a specific link.

**Query Parameters:**

- `startDate` (optional): Start date
- `endDate` (optional): End date
- `groupBy` (optional): 'day', 'week', 'month'

**Response:**

```json
{
  "data": {
    "totalClicks": 456,
    "uniqueClicks": 345,
    "deviceBreakdown": {
      "desktop": 234,
      "mobile": 189,
      "tablet": 33
    },
    "topCountries": {
      "US": 89,
      "ID": 67,
      "GB": 45
    },
    "topReferrers": [
      {
        "referrer": "https://twitter.com",
        "clicks": 56
      }
    ],
    "timeline": [
      {
        "date": "2024-01-01",
        "clicks": 45,
        "uniqueClicks": 34
      }
    ]
  }
}
```

#### POST /api/v1/bio-pages/:pageId/links/:linkId/track

Track a click on a link (public endpoint, no auth required).

**Request Body:**

```json
{
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://example.com",
  "utmSource": "twitter",
  "utmMedium": "social",
  "utmCampaign": "summer"
}
```

**Response:**

```json
{
  "message": "Click tracked successfully"
}
```

#### GET /api/v1/analytics/export

Export analytics data as CSV or JSON.

**Query Parameters:**

- `bioPageId` (required): Bio page ID
- `startDate` (required): Start date
- `endDate` (required): End date
- `format` (optional): 'csv' or 'json' (default: 'json')
- `includeLinks` (optional): Include individual link data

**Response:**

```json
{
  "data": [
    {
      "date": "2024-01-01",
      "bioPageId": "uuid",
      "bioLinkId": "uuid",
      "linkTitle": "Twitter",
      "clicks": 123,
      "uniqueClicks": 98,
      "deviceType": "mobile",
      "country": "US"
    }
  ]
}
```

### 5. Public Bio Page View

#### GET /p/:slug

Public endpoint to view a bio page (no auth required).

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "title": "My Profile",
    "description": "Personal links",
    "avatarUrl": "https://...",
    "themeConfig": { ... },
    "links": [
      {
        "id": "uuid",
        "title": "Twitter",
        "url": "https://twitter.com/user",
        "description": "Follow me on Twitter",
        "iconUrl": "https://...",
        "imageUrl": "https://...",
        "themeConfig": { ... }
      }
    ]
  }
}
```

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "slug",
        "message": "Slug must be unique"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., unique slug)
- `422 Unprocessable Entity`: Invalid data format
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing auth
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_RESOURCE`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Unexpected server error

## Validation Schemas (Zod)

### Bio Page Schema

```typescript
import { z } from 'zod';

export const bioPageSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  themeConfig: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    fontFamily: z.string(),
    buttonStyle: z.enum(['solid', 'outline', 'ghost']),
    borderRadius: z.number().min(0).max(50),
    spacing: z.enum(['compact', 'normal', 'relaxed']),
    layout: z.enum(['vertical', 'grid']),
  }).optional(),
  themePresetId: z.string().uuid().optional(),
});

export const bioPageUpdateSchema = bioPageSchema.partial();
```

### Bio Link Schema

```typescript
export const bioLinkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().max(200).optional(),
  iconUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  themeConfig: z.object({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    buttonStyle: z.enum(['solid', 'outline', 'ghost']),
    borderRadius: z.number().min(0).max(50),
  }).optional(),
});

export const bioLinkUpdateSchema = bioLinkSchema.partial();
```

### Theme Preset Schema

```typescript
export const themePresetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url().optional(),
  themeConfig: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    fontFamily: z.string(),
    buttonStyle: z.enum(['solid', 'outline', 'ghost']),
    borderRadius: z.number().min(0).max(50),
    spacing: z.enum(['compact', 'normal', 'relaxed']),
    layout: z.enum(['vertical', 'grid']),
  }),
});

export const themePresetUpdateSchema = themePresetSchema.partial();
```

## Rate Limiting

### Rate Limit Strategy

- Authenticated endpoints: 100 requests per minute per user
- Public endpoints (track clicks): 1000 requests per minute per IP
- Analytics export: 10 requests per hour per user

### Implementation

```typescript
// lib/api/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests" } },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        }
      }
    );
  }

  return null;
}
```

## File Structure

```
app/
├── api/
│   └── v1/
│       ├── bio-pages/
│       │   ├── route.ts (GET, POST)
│       │   └── [id]/
│       │       ├── route.ts (GET, PUT, DELETE)
│       │       ├── toggle-visibility/
│       │       │   └── route.ts (PATCH)
│       │       ├── links/
│       │       │   ├── route.ts (GET, POST)
│       │       │   ├── reorder/
│       │       │   │   └── route.ts (POST)
│       │       │   └── [linkId]/
│       │       │       ├── route.ts (GET, PUT, DELETE)
│       │       │       ├── toggle-visibility/
│       │       │       │   └── route.ts (PATCH)
│       │       │       ├── analytics/
│       │       │       │   └── route.ts (GET)
│       │       │       └── track/
│       │       │           └── route.ts (POST)
│       │       └── analytics/
│       │           └── route.ts (GET)
│       ├── theme-presets/
│       │   ├── route.ts (GET, POST)
│       │   └── [id]/
│       │       ├── route.ts (GET, PUT, DELETE)
│       │       └── duplicate/
│       │           └── route.ts (POST)
│       ├── analytics/
│       │   └── export/
│       │       └── route.ts (GET)
│       └── p/
│           └── [slug]/
│               └── route.ts (GET - public)
```

## Security Considerations

1. **Input Validation**: All inputs validated with Zod schemas
2. **SQL Injection Prevention**: Use parameterized queries via Drizzle ORM
3. **XSS Prevention**: Sanitize user-generated content
4. **CSRF Protection**: Implement CSRF tokens for state-changing operations
5. **Rate Limiting**: Prevent abuse and DDoS attacks
6. **IP Logging**: Track analytics with IP addresses (consider anonymization)
7. **HTTPS Only**: Enforce HTTPS in production
8. **CORS**: Configure CORS headers appropriately
9. **Content Security Policy**: Implement CSP headers
10. **Secure Headers**: Use security headers (HSTS, X-Frame-Options, etc.)

## Performance Optimization

1. **Database Indexing**: Proper indexes on frequently queried fields
2. **Query Optimization**: Use efficient queries with proper joins
3. **Caching**: Cache frequently accessed data (bio pages, theme presets)
4. **Pagination**: Implement pagination for list endpoints
5. **Compression**: Enable gzip/brotli compression
6. **CDN**: Use CDN for static assets (images, icons)
7. **Connection Pooling**: Use database connection pooling
8. **Lazy Loading**: Load related data only when needed
9. **Aggregated Tables**: Use pre-computed aggregates for analytics
10. **Background Jobs**: Process analytics aggregation asynchronously

## Testing Strategy

### Unit Tests

- Test each API route handler
- Test validation schemas
- Test middleware functions
- Test error handling

### Integration Tests

- Test full request/response cycles
- Test database operations
- Test authentication flow
- Test authorization checks

### E2E Tests

- Test complete user workflows
- Test public bio page view
- Test analytics tracking
- Test theme application

## Monitoring & Logging

### Request Logging

```typescript
// Log all API requests
export async function logRequest(request: Request, response: Response) {
  const log = {
    method: request.method,
    url: request.url,
    status: response.status,
    userId: session?.user?.id,
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
  };

  await db.insert(activityLogs).values(log);
}
```

### Error Tracking

- Use error tracking service (Sentry, LogRocket)
- Log all errors with context
- Alert on critical errors
- Monitor error rates

### Performance Monitoring

- Track API response times
- Monitor database query performance
- Track memory usage
- Monitor CPU usage
