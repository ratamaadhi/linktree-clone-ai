import { z } from 'zod';
import type { BioPageThemeConfig, BioLinkThemeConfig } from './types';

const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

export const bioPageThemeConfigSchema = z.object({
  primaryColor: z.string().regex(hexColorRegex),
  secondaryColor: z.string().regex(hexColorRegex),
  backgroundColor: z.string().regex(hexColorRegex),
  textColor: z.string().regex(hexColorRegex),
  secondaryTextColor: z.string().regex(hexColorRegex),
  fontFamily: z.string(),
  fontSize: z.object({
    base: z.string(),
    heading: z.string(),
    small: z.string(),
  }),
  fontWeight: z.object({
    normal: z.number().min(100).max(900),
    medium: z.number().min(100).max(900),
    bold: z.number().min(100).max(900),
  }),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
  padding: z.object({
    page: z.string(),
    section: z.string(),
    link: z.string(),
  }),
  layout: z.enum(['vertical', 'grid']),
  maxWidth: z.string(),
  alignment: z.enum(['left', 'center', 'right']),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']),
  borderRadius: z.number().min(0).max(50),
  borderWidth: z.number().min(0).max(10),
  shadow: z.enum(['none', 'small', 'medium', 'large']),
  avatarShape: z.enum(['circle', 'square', 'rounded']),
  avatarSize: z.enum(['small', 'medium', 'large']),
  animation: z.enum(['none', 'fade', 'slide', 'scale']),
  animationDuration: z.string(),
  backgroundType: z.enum(['solid', 'gradient', 'image']),
  backgroundGradient: z
    .object({
      type: z.enum(['linear', 'radial']),
      direction: z.string().optional(),
      colors: z.array(z.string().regex(hexColorRegex)),
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

export const bioLinkThemeConfigSchema = z.object({
  backgroundColor: z.string().regex(hexColorRegex).optional(),
  textColor: z.string().regex(hexColorRegex).optional(),
  borderColor: z.string().regex(hexColorRegex).optional(),
  hoverColor: z.string().regex(hexColorRegex).optional(),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
  borderWidth: z.number().min(0).max(10).optional(),
  shadow: z.enum(['none', 'small', 'medium', 'large']).optional(),
  fontSize: z.string().optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  iconPosition: z.enum(['left', 'right', 'none']).optional(),
  iconSize: z.enum(['small', 'medium', 'large']).optional(),
  showImage: z.boolean().optional(),
  imagePosition: z.enum(['left', 'right', 'background']).optional(),
  imageSize: z.enum(['small', 'medium', 'large']).optional(),
});

export function validateThemeConfig(config: unknown): BioPageThemeConfig {
  return bioPageThemeConfigSchema.parse(config);
}

export function validateLinkThemeConfig(config: unknown): BioLinkThemeConfig {
  return bioLinkThemeConfigSchema.parse(config);
}
