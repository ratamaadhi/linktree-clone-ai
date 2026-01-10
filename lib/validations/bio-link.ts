import { z } from 'zod';

export const bioLinkThemeConfigSchema = z.object({
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  textColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  hoverColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
  borderWidth: z.number().min(0).max(10).optional(),
  shadow: z.enum(['none', 'small', 'medium', 'large']).optional(),
  fontSize: z
    .string()
    .regex(/^\d+(px|rem|em)$/)
    .optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  padding: z
    .string()
    .regex(/^\d+(px|rem|em)$/)
    .optional(),
  margin: z
    .string()
    .regex(/^\d+(px|rem|em)$/)
    .optional(),
  iconPosition: z.enum(['left', 'right', 'none']).optional(),
  iconSize: z.enum(['small', 'medium', 'large']).optional(),
  showImage: z.boolean().optional(),
  imagePosition: z.enum(['left', 'right', 'background']).optional(),
  imageSize: z.enum(['small', 'medium', 'large']).optional(),
});

export const bioLinkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url(),
  description: z.string().max(200).optional(),
  iconUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
  themeConfig: bioLinkThemeConfigSchema.optional(),
});

export const bioLinkUpdateSchema = bioLinkSchema.partial();

export const bioLinkVisibilitySchema = z.object({
  isActive: z.boolean(),
});

export const bioLinksReorderSchema = z.object({
  links: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().min(0),
    })
  ),
});