import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioPageVisibilitySchema } from '@/lib/validations/bio-page';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const { isActive } = bioPageVisibilitySchema.parse(body);

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

    const [page] = await db
      .update(bioPages)
      .set({
        isActive,
        publishedAt:
          isActive && !existing.publishedAt ? new Date() : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(bioPages.id, params.id))
      .returning();

    return NextResponse.json({ data: page });
  } catch (error) {
    return handleApiError(error);
  }
}