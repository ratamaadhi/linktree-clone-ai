/**
 * Test data helpers for generating mock data
 */

import type { BioPageThemeConfig, BioLinkThemeConfig } from '@/lib/theme/types';

/**
 * Generate a valid bio page theme configuration for testing
 */
export function generateMockThemeConfig(
  overrides?: Partial<BioPageThemeConfig>
): BioPageThemeConfig {
  return {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    secondaryTextColor: '#6B7280',
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading: '24px',
      small: '14px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    spacing: 'normal',
    padding: {
      page: '20px',
      section: '16px',
      link: '12px',
    },
    layout: 'vertical',
    maxWidth: '600px',
    alignment: 'center',
    buttonStyle: 'solid',
    borderRadius: 8,
    borderWidth: 1,
    shadow: 'small',
    avatarShape: 'circle',
    avatarSize: 'medium',
    animation: 'fade',
    animationDuration: '0.3s',
    backgroundType: 'solid',
    ...overrides,
  };
}

/**
 * Generate a valid bio link theme configuration for testing
 */
export function generateMockLinkThemeConfig(
  overrides?: Partial<BioLinkThemeConfig>
): BioLinkThemeConfig {
  return {
    backgroundColor: '#3B82F6',
    textColor: '#FFFFFF',
    borderColor: '#3B82F6',
    hoverColor: '#2563EB',
    buttonStyle: 'solid',
    borderRadius: 8,
    borderWidth: 1,
    shadow: 'small',
    fontSize: '16px',
    fontWeight: 500,
    padding: '12px',
    margin: '8px',
    iconPosition: 'left',
    iconSize: 'medium',
    ...overrides,
  };
}

/**
 * Generate mock bio page data
 */
export function generateMockBioPage(overrides?: {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  avatarUrl?: string;
  isActive?: boolean;
}) {
  return {
    id: overrides?.id || '00000000-0000-0000-0000-000000000001',
    userId: '00000000-0000-0000-0000-000000000001',
    title: overrides?.title || 'My Bio Page',
    slug: overrides?.slug || 'my-bio-page',
    description: overrides?.description || 'Welcome to my bio page',
    avatarUrl: overrides?.avatarUrl || 'https://example.com/avatar.jpg',
    isActive: overrides?.isActive !== undefined ? overrides.isActive : true,
    themeConfig: generateMockThemeConfig(),
    themePresetId: null,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: null,
  };
}

/**
 * Generate mock bio link data
 */
export function generateMockBioLink(overrides?: {
  id?: string;
  bioPageId?: string;
  title?: string;
  url?: string;
  description?: string;
  iconUrl?: string;
  imageUrl?: string;
  isActive?: boolean;
  order?: number;
}) {
  return {
    id: overrides?.id || '00000000-0000-0000-0000-000000000002',
    bioPageId: overrides?.bioPageId || '00000000-0000-0000-0000-000000000001',
    title: overrides?.title || 'Example Link',
    url: overrides?.url || 'https://example.com',
    description: overrides?.description || 'An example link',
    iconUrl: overrides?.iconUrl || null,
    imageUrl: overrides?.imageUrl || null,
    isActive: overrides?.isActive !== undefined ? overrides.isActive : true,
    order: overrides?.order || 0,
    themeConfig: generateMockLinkThemeConfig(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Generate mock user data
 */
export function generateMockUser(overrides?: {
  id?: string;
  name?: string;
  email?: string;
}) {
  return {
    id: overrides?.id || '00000000-0000-0000-0000-000000000001',
    name: overrides?.name || 'Test User',
    email: overrides?.email || 'test@example.com',
    image: null,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Generate mock session data
 */
export function generateMockSession(overrides?: {
  userId?: string;
  expiresAt?: Date;
  token?: string;
}) {
  return {
    userId: overrides?.userId || '00000000-0000-0000-0000-000000000001',
    expiresAt:
      overrides?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    token: overrides?.token || 'mock-session-token',
    id: '00000000-0000-0000-0000-000000000001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Generate mock analytics data
 */
export function generateMockAnalytics(overrides?: {
  id?: string;
  bioLinkId?: string;
  bioPageId?: string;
  clickedAt?: Date;
  deviceType?: string;
  browser?: string;
  country?: string;
}) {
  return {
    id: overrides?.id || '00000000-0000-0000-0000-000000000003',
    bioLinkId: overrides?.bioLinkId || '00000000-0000-0000-0000-000000000002',
    bioPageId: overrides?.bioPageId || '00000000-0000-0000-0000-000000000001',
    clickedAt: overrides?.clickedAt || new Date(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Test Browser)',
    referrer: 'https://google.com',
    country: overrides?.country || 'US',
    city: 'New York',
    deviceType: overrides?.deviceType || 'desktop',
    browser: overrides?.browser || 'chrome',
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
  };
}

/**
 * Common valid slugs for testing
 */
export const VALID_SLUGS = [
  'my-bio-page',
  'john-doe',
  'test-page-123',
  'abc',
  'test123',
  'my-awesome-page',
];

/**
 * Common invalid slugs for testing
 */
export const INVALID_SLUGS = [
  '', // empty
  'ab', // too short (less than 3)
  'My Bio Page', // spaces and uppercase
  'my_bio_page', // underscores
  'my.page', // dots
  'my/page', // slashes
  'my!page', // special characters
  'a'.repeat(51), // too long (more than 50)
];

/**
 * Common valid URLs for testing
 */
export const VALID_URLS = [
  'https://example.com',
  'https://www.example.com',
  'https://example.com/path',
  'https://example.com/path?query=value',
  'https://example.com/path#hash',
];

/**
 * Common invalid URLs for testing
 * Note: zod's URL() validator accepts many URL formats including javascript: and data:
 * These are truly invalid URLs that fail zod's URL() validation
 */
export const INVALID_URLS = [
  '//',
  'not a url at all!',
  'ht!tp://invalid.com',
  'http://',
  'https:// with space',
];

/**
 * Common valid hex colors for testing
 */
export const VALID_COLORS = [
  '#FFFFFF',
  '#000000',
  '#3B82F6',
  '#10B981',
  '#ff0000',
];

/**
 * Common invalid hex colors for testing
 */
export const INVALID_COLORS = [
  'FFF',
  'FFFFFF',
  '#GGG',
  '#3B8',
  '#ZZZZZZ',
  'rgb(255, 255, 255)',
];
