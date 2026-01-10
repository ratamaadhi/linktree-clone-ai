import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioPageSchema } from '@/lib/validations/bio-page';
import { eq, desc, sql, and } from 'drizzle-orm';

// GET /api/v1/bio-pages - List all bio pages
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions = [eq(bioPages.userId, session.user.id)];

    if (organizationId) {
      conditions.push(eq(bioPages.organizationId, organizationId));
    }

    if (isActive !== null) {
      conditions.push(eq(bioPages.isActive, isActive === 'true'));
    }

    const pages = await db.query.bioPages.findMany({
      where: and(...conditions),
      orderBy: [desc(bioPages.createdAt)],
      limit,
      offset,
    });

    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bioPages)
      .where(and(...conditions));

    return NextResponse.json({
      data: pages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/v1/bio-pages - Create new bio page
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const data = bioPageSchema.parse(body);

    // Check if slug is unique
    const existing = await db.query.bioPages.findFirst({
      where: eq(bioPages.slug, data.slug),
    });

    if (existing) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_RESOURCE',
            message: 'Slug already exists',
          },
        },
        { status: 409 }
      );
    }

    const [page] = await db
      .insert(bioPages)
      .values({
        ...data,
        userId: session.user.id,
        publishedAt: data.isActive ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ data: page }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
