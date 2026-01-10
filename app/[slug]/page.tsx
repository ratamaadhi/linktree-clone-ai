import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { bioPages, bioLinks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { PublicBioPageClient } from './public-bio-page';

export default async function PublicBioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pages = await db
    .select({
      id: bioPages.id,
      title: bioPages.title,
      description: bioPages.description,
      avatarUrl: bioPages.avatarUrl,
      slug: bioPages.slug,
      themeConfig: bioPages.themeConfig,
      links: {
        id: bioLinks.id,
        title: bioLinks.title,
        url: bioLinks.url,
        description: bioLinks.description,
        iconUrl: bioLinks.iconUrl,
        imageUrl: bioLinks.imageUrl,
        isActive: bioLinks.isActive,
        order: bioLinks.order,
        themeConfig: bioLinks.themeConfig,
      },
    })
    .from(bioPages)
    .leftJoin(bioLinks, eq(bioPages.id, bioLinks.bioPageId))
    .where(and(eq(bioPages.slug, slug), eq(bioPages.isActive, true)));

  if (!pages || pages.length === 0) {
    notFound();
  }

  const pageData = {
    id: pages[0].id,
    title: pages[0].title,
    description: pages[0].description,
    avatarUrl: pages[0].avatarUrl,
    slug: pages[0].slug,
    themeConfig: pages[0].themeConfig as Record<string, unknown>,
    links: pages
      .filter((p) => p.links)
      .map((p) => p.links!)
      .sort((a, b) => a.order - b.order),
  };

  return <PublicBioPageClient bioPage={pageData} />;
}
