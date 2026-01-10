import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { themePresets } from '@/lib/db/schema';
import { requireAuth, handleApiError } from '@/lib/api/middleware';
import { themePresetSchema } from '@/lib/validations/theme-preset';
import { eq, desc, or } from 'drizzle-orm';

// GET /api/v1/theme-presets - List theme presets
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const isSystemPreset = searchParams.get('isSystemPreset');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions = [
      or(
        eq(themePresets.userId, session.user.id),
        eq(themePresets.isSystemPreset, true)
      ),
    ];

    if (organizationId) {
      conditions.push(eq(themePresets.organizationId, organizationId));
    }

    if (isSystemPreset !== null) {
      conditions.push(
        eq(themePresets.isSystemPreset, isSystemPreset === 'true')
      );
    }

    const presets = await db.query.themePresets.findMany({
      where: or(
        eq(themePresets.userId, session.user.id),
        eq(themePresets.isSystemPreset, true)
      ),
      orderBy: [desc(themePresets.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({ data: presets });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/v1/theme-presets - Create theme preset
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);

    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    const data = themePresetSchema.parse(body);

    const [preset] = await db
      .insert(themePresets)
      .values({
        ...data,
        userId: session.user.id,
        isSystemPreset: false,
        usageCount: 0,
      })
      .returning();

    return NextResponse.json({ data: preset }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
