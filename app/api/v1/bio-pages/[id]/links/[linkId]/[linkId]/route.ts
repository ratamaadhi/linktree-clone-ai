import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioLinkUpdateSchema } from '@/lib/validations/bio-link';
import { eq, and } from 'drizzle-orm';

// PUT /api/v1/bio-pages/:pageId/links/:linkId - Update link
export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string; linkId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
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

    const body = await request.json();
    const data = bioLinkUpdateSchema.parse(body);

    const [link] = await db
      .update(bioLinks)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, params.linkId))
      .returning();

    return NextResponse.json({ data: link });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/v1/bio-pages/:pageId/links/:linkId - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string; linkId: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify bio page ownership
    const bioPage = await db.query.bioPages.findFirst({
      where: and(
        eq(bioPages.id, params.pageId),
        eq(bioPages.userId, session.user.id)
      ),
    });

    if (!bioPage) {
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

    await db.delete(bioLinks).where(eq(bioLinks.id, params.linkId));

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
