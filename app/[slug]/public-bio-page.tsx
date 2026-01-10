'use client';

import * as React from 'react';
import { linkTracker } from '@/lib/analytics/tracker';

interface BioLinkThemeConfig {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  borderRadius?: number;
  borderWidth?: number;
  shadow?: 'none' | 'small' | 'medium' | 'large';
  fontSize?: string;
  fontWeight?: number;
  padding?: string;
  margin?: string;
  iconPosition?: 'left' | 'right' | 'none';
  iconSize?: 'small' | 'medium' | 'large';
  showImage?: boolean;
  imagePosition?: 'left' | 'right' | 'background';
  imageSize?: 'small' | 'medium' | 'large';
}

interface BioPageThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  fontFamily?: string;
  fontSize?: {
    base?: string;
    heading?: string;
    small?: string;
  };
  fontWeight?: {
    normal?: number;
    medium?: number;
    bold?: number;
  };
  spacing?: string;
  padding?: {
    page?: string;
    section?: string;
    link?: string;
  };
  layout?: 'vertical' | 'grid';
  maxWidth?: string;
  alignment?: 'left' | 'center' | 'right';
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  borderRadius?: number;
  borderWidth?: number;
  shadow?: 'none' | 'small' | 'medium' | 'large';
  avatarShape?: 'circle' | 'square' | 'rounded';
  avatarSize?: 'small' | 'medium' | 'large';
  animation?: 'none' | 'fade' | 'slide' | 'scale';
  animationDuration?: string;
  backgroundType?: 'solid' | 'gradient' | 'image';
  backgroundGradient?: {
    type?: 'linear' | 'radial';
    direction?: string;
    colors?: string[];
  };
  backgroundImage?: {
    url?: string;
    position?: 'cover' | 'contain' | 'center';
    opacity?: number;
  };
}

interface BioLink {
  id: string;
  title: string;
  url: string;
  description?: string | null;
  iconUrl?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  order: number;
  themeConfig?: BioLinkThemeConfig | null;
}

interface BioPage {
  id: string;
  title: string;
  description?: string | null;
  avatarUrl?: string | null;
  slug: string;
  links: BioLink[];
  themeConfig: BioPageThemeConfig;
}

interface PublicBioPageProps {
  bioPage: BioPage;
}

export function PublicBioPageClient({ bioPage }: PublicBioPageProps) {
  const activeLinks = bioPage.links.filter((link) => link.isActive);
  const theme = bioPage.themeConfig;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: BioLink
  ) => {
    e.preventDefault();
    linkTracker.trackAndNavigate(link.id, bioPage.id, link.url);
  };

  const avatarSizeMap: Record<string, string> = {
    small: '64px',
    medium: '96px',
    large: '128px',
  };

  const iconSizeMap: Record<string, string> = {
    small: '16px',
    medium: '24px',
    large: '32px',
  };

  const imageSizeMap: Record<string, string> = {
    small: '32px',
    medium: '48px',
    large: '64px',
  };

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundColor: theme.backgroundColor || '#ffffff',
        color: theme.textColor || '#000000',
        fontFamily: theme.fontFamily || 'sans-serif',
        padding: `${theme.padding?.page || '2rem'} 1rem`,
        backgroundImage:
          theme.backgroundType === 'gradient'
            ? `linear-gradient(${theme.backgroundGradient?.direction || 'to right'}, ${theme.backgroundGradient?.colors?.join(', ') || '#ffffff, #ffffff'})`
            : undefined,
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: theme.maxWidth || '680px',
        }}
      >
        {bioPage.avatarUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={bioPage.avatarUrl}
              alt={`${bioPage.title} avatar`}
              className="rounded-full object-cover"
              style={{
                width: avatarSizeMap[theme.avatarSize || 'medium'] || '96px',
                height: avatarSizeMap[theme.avatarSize || 'medium'] || '96px',
                borderRadius: theme.avatarShape === 'square' ? '12px' : '50%',
              }}
            />
          </div>
        )}

        <div
          className="mb-8 text-center"
          style={{
            textAlign:
              theme.alignment === 'left'
                ? 'left'
                : theme.alignment === 'right'
                  ? 'right'
                  : 'center',
          }}
        >
          <h1
            className="mb-2 font-bold"
            style={{
              fontSize: theme.fontSize?.heading || '1.5rem',
              fontWeight: theme.fontWeight?.bold || '700',
            }}
          >
            {bioPage.title}
          </h1>
          {bioPage.description && (
            <p
              className="opacity-80"
              style={{
                fontSize: theme.fontSize?.base || '1rem',
                color: theme.secondaryTextColor || theme.textColor,
              }}
            >
              {bioPage.description}
            </p>
          )}
        </div>

        <div
          className="flex flex-col gap-4"
          style={{
            gap: theme.spacing || '1rem',
          }}
        >
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              onClick={(e) => handleClick(e, link)}
              className="relative flex w-full items-center gap-3 overflow-hidden rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor:
                  link.themeConfig?.backgroundColor ||
                  theme.buttonStyle === 'outline'
                    ? 'transparent'
                    : 'rgba(0, 0, 0, 0.05)',
                border:
                  theme.buttonStyle === 'outline'
                    ? `1px solid ${theme.textColor}`
                    : 'none',
                borderRadius: `${theme.borderRadius || 8}px`,
                padding: `${theme.padding?.link || '1rem'}`,
                color: link.themeConfig?.textColor || theme.textColor,
                textDecoration: 'none',
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.iconUrl && (
                <img
                  src={link.iconUrl}
                  alt={`${link.title} icon`}
                  className="shrink-0"
                  style={{
                    width:
                      iconSizeMap[link.themeConfig?.iconSize || 'medium'] ||
                      '24px',
                    height:
                      iconSizeMap[link.themeConfig?.iconSize || 'medium'] ||
                      '24px',
                  }}
                />
              )}

              {link.imageUrl && (
                <img
                  src={link.imageUrl}
                  alt={`${link.title} image`}
                  className="shrink-0 object-cover"
                  style={{
                    width:
                      imageSizeMap[link.themeConfig?.imageSize || 'medium'] ||
                      '48px',
                    height:
                      imageSizeMap[link.themeConfig?.imageSize || 'medium'] ||
                      '48px',
                    borderRadius: '8px',
                  }}
                />
              )}

              <div className="flex flex-1 flex-col">
                <span
                  className="font-medium"
                  style={{
                    fontSize:
                      link.themeConfig?.fontSize ||
                      theme.fontSize?.base ||
                      '1rem',
                    fontWeight:
                      link.themeConfig?.fontWeight ||
                      theme.fontWeight?.medium ||
                      '500',
                  }}
                >
                  {link.title}
                </span>
                {link.description && (
                  <span
                    className="text-sm opacity-75"
                    style={{
                      color: theme.secondaryTextColor || theme.textColor,
                    }}
                  >
                    {link.description}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
