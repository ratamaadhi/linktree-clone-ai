import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioPageUpdateSchema } from '@/lib/validations/bio-page';
import { eq, and } from 'drizzle-orm';

// GET /api/v1/bio-pages/:id - Get single bio page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const page = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
      with: {
        links: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: page });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/v1/bio-pages/:id - Update bio page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const data = bioPageUpdateSchema.parse(body);

    // Verify ownership
    const existing = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.bioPages.findFirst({
        where: eq(bioPages.slug, data.slug),
      });

      if (slugExists) {
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
    }

    const [page] = await db
      .update(bioPages)
      .set({
        ...data,
        updatedAt: new Date(),
        publishedAt:
          data.isActive && !existing.isActive
            ? new Date()
            : existing.publishedAt,
      })
      .where(eq(bioPages.id, params.id))
      .returning();

    return NextResponse.json({ data: page });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/v1/bio-pages/:id - Delete bio page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify ownership
    const existing = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.id),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Bio page not found',
          },
        },
        { status: 404 }
      );
    }

    await db.delete(bioPages).where(eq(bioPages.id, params.id));

    return NextResponse.json({ message: 'Bio page deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
