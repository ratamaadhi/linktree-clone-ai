import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioLinksReorderSchema } from '@/lib/validations/bio-link';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } }
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
    const { links } = bioLinksReorderSchema.parse(body);

    // Update all links in a transaction
    await db.transaction(async (tx) => {
      for (const link of links) {
        await tx
          .update(bioLinks)
          .set({ order: link.order })
          .where(eq(bioLinks.id, link.id));
      }
    });

    return NextResponse.json({
      message: 'Links reordered successfully',
      data: links,
    });
  } catch (error) {
    return handleApiError(error);
  }
}