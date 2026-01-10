'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface PreviewContentProps {
  bioPage: {
    title: string;
    description: string;
    avatarUrl: string;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    description?: string;
    iconUrl?: string;
    imageUrl?: string;
    themeConfig?: Record<string, unknown>;
  }>;
  onLinkClick?: (linkId: string) => void;
}

export function PreviewContent({
  bioPage,
  links,
  onLinkClick,
}: PreviewContentProps) {
  return (
    <div className="bio-page-preview h-full overflow-y-auto p-6">
      {bioPage.avatarUrl && (
        <img
          src={bioPage.avatarUrl}
          alt={bioPage.title}
          className="bio-avatar mx-auto mb-4 h-24 w-24 object-cover"
        />
      )}

      <h1 className="bio-title mb-2 text-2xl font-bold">{bioPage.title}</h1>

      {bioPage.description && (
        <p className="bio-description mb-6 text-gray-600">
          {bioPage.description}
        </p>
      )}

      <div className="bio-links space-y-3">
        {links.map((link) => (
          <LinkPreview
            key={link.id}
            link={link}
            onClick={() => onLinkClick?.(link.id)}
          />
        ))}
      </div>
    </div>
  );
}

function LinkPreview({
  link,
  onClick,
}: {
  link: PreviewContentProps['links'][0];
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onClick?.();
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <a
      href={link.url}
      className={cn(
        'bio-link block',
        link.themeConfig && 'custom-theme',
        isHovered && 'hovered'
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {link.imageUrl && (
        <img
          src={link.imageUrl}
          alt=""
          className="link-image mb-2 h-24 w-full rounded object-cover"
        />
      )}

      <div className="link-content flex items-center">
        {link.iconUrl && (
          <img src={link.iconUrl} alt="" className="link-icon mr-3 h-5 w-5" />
        )}

        <div className="link-text flex-1">
          <span className="link-title font-medium">{link.title}</span>
          {link.description && (
            <span className="link-description ml-2 text-sm text-gray-600">
              {link.description}
            </span>
          )}
        </div>

        <ExternalLink className="link-external-icon ml-2 h-4 w-4 text-gray-400" />
      </div>
    </a>
  );
}
