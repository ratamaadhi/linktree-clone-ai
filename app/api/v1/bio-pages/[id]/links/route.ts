import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { bioLinkSchema } from '@/lib/validations/bio-link';
import { eq, and, asc } from 'drizzle-orm';

// GET /api/v1/bio-pages/:pageId/links - List links
export async function GET(
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

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const conditions = [eq(bioLinks.bioPageId, params.pageId)];

    if (isActive !== null) {
      conditions.push(eq(bioLinks.isActive, isActive === 'true'));
    }

    const links = await db.query.bioLinks.findMany({
      where: eq(bioLinks.bioPageId, params.pageId),
      orderBy: [asc(bioLinks.order)],
    });

    return NextResponse.json({ data: links });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/v1/bio-pages/:pageId/links - Create link
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
    const data = bioLinkSchema.parse(body);

    const [link] = await db
      .insert(bioLinks)
      .values({
        ...data,
        bioPageId: params.pageId,
      })
      .returning();

    return NextResponse.json({ data: link }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
