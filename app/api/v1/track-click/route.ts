import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { linkAnalytics } from '@/lib/db/schema/link-analytics';
import { parseUserAgent } from '@/lib/analytics/user-agent-parser';
import { hashIP } from '@/lib/analytics/ip-hasher';
import { headers } from 'next/headers';

interface TrackClickRequest {
  clicks: Array<{
    bioLinkId: string;
    bioPageId: string;
    url: string;
    timestamp: string;
    userAgent: string;
    referrer: string | null;
    screenWidth: number;
    screenHeight: number;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmTerm?: string | null;
    utmContent?: string | null;
  }>;
}

export async function POST(request: Request) {
  try {
    const body: TrackClickRequest = await request.json();
    const { clicks } = body;

    if (!Array.isArray(clicks) || clicks.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: 'Clicks array is required',
          },
        },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const ipAddress =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown';

    const analyticsData = clicks.map((click) => {
      const deviceInfo = parseUserAgent(click.userAgent);

      return {
        bioLinkId: click.bioLinkId,
        bioPageId: click.bioPageId,
        ipAddress: hashIP(ipAddress),
        userAgent: click.userAgent,
        referrer: click.referrer,
        country: null,
        city: null,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        utmSource: click.utmSource || null,
        utmMedium: click.utmMedium || null,
        utmCampaign: click.utmCampaign || null,
        utmTerm: click.utmTerm || null,
        utmContent: click.utmContent || null,
        clickedAt: new Date(click.timestamp),
      };
    });

    await db.insert(linkAnalytics).values(analyticsData);

    return NextResponse.json(
      { success: true, tracked: clicks.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking clicks:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to track clicks' } },
      { status: 500 }
    );
  }
}
