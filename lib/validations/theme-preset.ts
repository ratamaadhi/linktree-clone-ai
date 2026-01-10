import { z } from 'zod';
import { bioPageThemeConfigSchema } from './bio-page';

export const themePresetSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  thumbnailUrl: z.string().url().optional(),
  themeConfig: bioPageThemeConfigSchema,
});

export const themePresetUpdateSchema = themePresetSchema.partial();