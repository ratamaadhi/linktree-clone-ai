import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themePresets } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { themePresetUpdateSchema } from '@/lib/validations/theme-preset';
import { eq, and, or } from 'drizzle-orm';

// GET /api/v1/theme-presets/:id - Get single theme preset
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const preset = await db.query.themePresets.findFirst({
      where: or(
        and(
          eq(themePresets.id, params.id),
          eq(themePresets.userId, session.user.id)
        ),
        and(
          eq(themePresets.id, params.id),
          eq(themePresets.isSystemPreset, true)
        )
      ),
    });

    if (!preset) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Theme preset not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: preset });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/v1/theme-presets/:id - Update theme preset
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify ownership (can't update system presets)
    const existing = await db.query.themePresets.findFirst({
      where: and(
        eq(themePresets.id, params.id),
        eq(themePresets.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Theme preset not found',
          },
        },
        { status: 404 }
      );
    }

    if (existing.isSystemPreset) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Cannot modify system presets',
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = themePresetUpdateSchema.parse(body);

    const [preset] = await db
      .update(themePresets)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(themePresets.id, params.id))
      .returning();

    return NextResponse.json({ data: preset });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/v1/theme-presets/:id - Delete theme preset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    // Verify ownership (can't delete system presets)
    const existing = await db.query.themePresets.findFirst({
      where: and(
        eq(themePresets.id, params.id),
        eq(themePresets.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Theme preset not found',
          },
        },
        { status: 404 }
      );
    }

    if (existing.isSystemPreset) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Cannot delete system presets',
          },
        },
        { status: 403 }
      );
    }

    await db.delete(themePresets).where(eq(themePresets.id, params.id));

    return NextResponse.json({ message: 'Theme preset deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
