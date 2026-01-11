/**
 * Unit tests for theme preset validation schemas
 */

import {
  themePresetSchema,
  themePresetUpdateSchema,
} from '@/lib/validations/theme-preset';
import { VALID_URLS, INVALID_URLS } from '@/tests/helpers';

describe('themePresetSchema', () => {
  describe('name validation', () => {
    it('should accept valid names', () => {
      const validNames = [
        'My Theme',
        'A',
        'X'.repeat(100),
        'Theme with numbers 123',
        'Special-chars_here!',
      ];

      validNames.forEach((name) => {
        const result = themePresetSchema.safeParse({
          name,
          themeConfig: {
            primaryColor: '#000000',
            secondaryColor: '#000000',
            backgroundColor: '#000000',
            textColor: '#000000',
            secondaryTextColor: '#000000',
            fontFamily: 'Arial',
            fontSize: { base: '16px', heading: '24px', small: '14px' },
            fontWeight: { normal: 400, medium: 500, bold: 700 },
            spacing: 'normal',
            padding: { page: '20px', section: '16px', link: '12px' },
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
          },
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject empty names', () => {
      const result = themePresetSchema.safeParse({
        name: '',
        themeConfig: {
          primaryColor: '#000000',
          secondaryColor: '#000000',
          backgroundColor: '#000000',
          textColor: '#000000',
          secondaryTextColor: '#000000',
          fontFamily: 'Arial',
          fontSize: { base: '16px', heading: '24px', small: '14px' },
          fontWeight: { normal: 400, medium: 500, bold: 700 },
          spacing: 'normal',
          padding: { page: '20px', section: '16px', link: '12px' },
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
        },
      });
      expect(result.success).toBe(false);
    });

    it('should reject names longer than 100 characters', () => {
      const result = themePresetSchema.safeParse({
        name: 'X'.repeat(101),
        themeConfig: {
          primaryColor: '#000000',
          secondaryColor: '#000000',
          backgroundColor: '#000000',
          textColor: '#000000',
          secondaryTextColor: '#000000',
          fontFamily: 'Arial',
          fontSize: { base: '16px', heading: '24px', small: '14px' },
          fontWeight: { normal: 400, medium: 500, bold: 700 },
          spacing: 'normal',
          padding: { page: '20px', section: '16px', link: '12px' },
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
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    const validThemeConfig = {
      primaryColor: '#000000',
      secondaryColor: '#000000',
      backgroundColor: '#000000',
      textColor: '#000000',
      secondaryTextColor: '#000000',
      fontFamily: 'Arial',
      fontSize: { base: '16px', heading: '24px', small: '14px' },
      fontWeight: { normal: 400, medium: 500, bold: 700 },
      spacing: 'normal',
      padding: { page: '20px', section: '16px', link: '12px' },
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
    };

    it('should accept valid descriptions', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        description: 'A valid description',
        themeConfig: validThemeConfig,
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty description', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        description: '',
        themeConfig: validThemeConfig,
      });
      expect(result.success).toBe(true);
    });

    it('should reject descriptions longer than 500 characters', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        description: 'X'.repeat(501),
        themeConfig: validThemeConfig,
      });
      expect(result.success).toBe(false);
    });

    it('should make description optional', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        themeConfig: validThemeConfig,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('thumbnailUrl validation', () => {
    const validThemeConfig = {
      primaryColor: '#000000',
      secondaryColor: '#000000',
      backgroundColor: '#000000',
      textColor: '#000000',
      secondaryTextColor: '#000000',
      fontFamily: 'Arial',
      fontSize: { base: '16px', heading: '24px', small: '14px' },
      fontWeight: { normal: 400, medium: 500, bold: 700 },
      spacing: 'normal',
      padding: { page: '20px', section: '16px', link: '12px' },
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
    };

    it('should accept valid URLs', () => {
      VALID_URLS.forEach((thumbnailUrl) => {
        const result = themePresetSchema.safeParse({
          name: 'My Theme',
          thumbnailUrl,
          themeConfig: validThemeConfig,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      INVALID_URLS.forEach((thumbnailUrl) => {
        const result = themePresetSchema.safeParse({
          name: 'My Theme',
          thumbnailUrl,
          themeConfig: validThemeConfig,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should make thumbnailUrl optional', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        themeConfig: validThemeConfig,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('themeConfig validation', () => {
    it('should require themeConfig', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
      });
      expect(result.success).toBe(false);
    });

    it('should validate themeConfig using bioPageThemeConfigSchema', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        themeConfig: {
          primaryColor: 'invalid-color',
          secondaryColor: '#000000',
          backgroundColor: '#000000',
          textColor: '#000000',
          secondaryTextColor: '#000000',
          fontFamily: 'Arial',
          fontSize: { base: '16px', heading: '24px', small: '14px' },
          fontWeight: { normal: 400, medium: 500, bold: 700 },
          spacing: 'normal',
          padding: { page: '20px', section: '16px', link: '12px' },
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
        },
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid themeConfig', () => {
      const result = themePresetSchema.safeParse({
        name: 'My Theme',
        themeConfig: {
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          secondaryTextColor: '#6B7280',
          fontFamily: 'Inter, sans-serif',
          fontSize: { base: '16px', heading: '24px', small: '14px' },
          fontWeight: { normal: 400, medium: 500, bold: 700 },
          spacing: 'normal',
          padding: { page: '20px', section: '16px', link: '12px' },
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
        },
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('themePresetUpdateSchema', () => {
  it('should accept partial updates', () => {
    const result = themePresetUpdateSchema.safeParse({
      name: 'Updated Name',
    });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = themePresetUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept multiple fields', () => {
    const result = themePresetUpdateSchema.safeParse({
      name: 'Updated Name',
      description: 'Updated description',
    });
    expect(result.success).toBe(true);
  });

  it('should allow updating thumbnailUrl', () => {
    const result = themePresetUpdateSchema.safeParse({
      thumbnailUrl: 'https://example.com/new-thumbnail.jpg',
    });
    expect(result.success).toBe(true);
  });
});
