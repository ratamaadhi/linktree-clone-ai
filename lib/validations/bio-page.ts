import { z } from 'zod';

export const bioPageThemeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontFamily: z.string().min(1).max(100),
  fontSize: z.object({
    base: z.string().regex(/^\d+(px|rem|em)$/),
    heading: z.string().regex(/^\d+(px|rem|em)$/),
    small: z.string().regex(/^\d+(px|rem|em)$/),
  }),
  fontWeight: z.object({
    normal: z.number().min(100).max(900),
    medium: z.number().min(100).max(900),
    bold: z.number().min(100).max(900),
  }),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
  padding: z.object({
    page: z.string().regex(/^\d+(px|rem|em)$/),
    section: z.string().regex(/^\d+(px|rem|em)$/),
    link: z.string().regex(/^\d+(px|rem|em)$/),
  }),
  layout: z.enum(['vertical', 'grid']),
  maxWidth: z.string().regex(/^\d+(px|rem|em|%|vw|vh)$/),
  alignment: z.enum(['left', 'center', 'right']),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']),
  borderRadius: z.number().min(0).max(50),
  borderWidth: z.number().min(0).max(10),
  shadow: z.enum(['none', 'small', 'medium', 'large']),
  avatarShape: z.enum(['circle', 'square', 'rounded']),
  avatarSize: z.enum(['small', 'medium', 'large']),
  animation: z.enum(['none', 'fade', 'slide', 'scale']),
  animationDuration: z.string().regex(/^\d+(\.\d+)?s$/),
  backgroundType: z.enum(['solid', 'gradient', 'image']),
  backgroundGradient: z
    .object({
      type: z.enum(['linear', 'radial']),
      direction: z.string().optional(),
      colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(2),
    })
    .optional(),
  backgroundImage: z
    .object({
      url: z.string().url(),
      position: z.enum(['cover', 'contain', 'center']),
      opacity: z.number().min(0).max(1),
    })
    .optional(),
});

export const bioPageSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  themeConfig: bioPageThemeConfigSchema.optional(),
  themePresetId: z.string().uuid().optional(),
});

export const bioPageUpdateSchema = bioPageSchema.partial();

export const bioPageVisibilitySchema = z.object({
  isActive: z.boolean(),
});