/**
 * Unit tests for bio page validation schemas
 */

import {
  bioPageSchema,
  bioPageUpdateSchema,
  bioPageVisibilitySchema,
  bioPageThemeConfigSchema,
} from '@/lib/validations/bio-page';
import {
  VALID_COLORS,
  INVALID_COLORS,
  VALID_SLUGS,
  INVALID_SLUGS,
  VALID_URLS,
  INVALID_URLS,
} from '@/tests/helpers';

describe('bioPageSchema', () => {
  describe('title validation', () => {
    it('should accept valid titles', () => {
      const validTitles = [
        'My Bio Page',
        'A',
        'X'.repeat(100),
        'Page with numbers 123',
        'Special-chars_here!',
      ];

      validTitles.forEach((title) => {
        const result = bioPageSchema.safeParse({
          title,
          slug: 'test-slug',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid titles', () => {
      const invalidTitles = [
        '', // empty
      ];

      invalidTitles.forEach((title) => {
        const result = bioPageSchema.safeParse({
          title,
          slug: 'test-slug',
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject titles longer than 100 characters', () => {
      const result = bioPageSchema.safeParse({
        title: 'X'.repeat(101),
        slug: 'test-slug',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('slug validation', () => {
    it('should accept valid slugs', () => {
      VALID_SLUGS.forEach((slug) => {
        const result = bioPageSchema.safeParse({
          title: 'Test Page',
          slug,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid slugs', () => {
      INVALID_SLUGS.forEach((slug) => {
        const result = bioPageSchema.safeParse({
          title: 'Test Page',
          slug,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should trim whitespace from slug', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: '  my-slug  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe('my-slug');
      }
    });
  });

  describe('description validation', () => {
    it('should accept valid descriptions', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
        description: 'A valid description',
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty description', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
        description: '',
      });
      expect(result.success).toBe(true);
    });

    it('should reject descriptions longer than 500 characters', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
        description: 'X'.repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it('should make description optional', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('avatarUrl validation', () => {
    it('should accept valid URLs', () => {
      VALID_URLS.forEach((avatarUrl) => {
        const result = bioPageSchema.safeParse({
          title: 'Test Page',
          slug: 'test-slug',
          avatarUrl,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      INVALID_URLS.forEach((avatarUrl) => {
        const result = bioPageSchema.safeParse({
          title: 'Test Page',
          slug: 'test-slug',
          avatarUrl,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should make avatarUrl optional', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('isActive validation', () => {
    it('should accept boolean values', () => {
      const result1 = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
        isActive: true,
      });
      const result2 = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
        isActive: false,
      });
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it('should default to true', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe('themePresetId validation', () => {
    it('should accept valid UUIDs', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
        themePresetId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      const invalidUuids = ['not-a-uuid', '12345', '550e8400-e29b-41d4-a716'];

      invalidUuids.forEach((themePresetId) => {
        const result = bioPageSchema.safeParse({
          title: 'Test Page',
          slug: 'test-slug',
          themePresetId,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should make themePresetId optional', () => {
      const result = bioPageSchema.safeParse({
        title: 'Test Page',
        slug: 'test-slug',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('bioPageThemeConfigSchema', () => {
  describe('color validation', () => {
    it('should accept valid hex colors', () => {
      VALID_COLORS.forEach((color) => {
        const result = bioPageThemeConfigSchema.safeParse({
          primaryColor: color,
          secondaryColor: color,
          backgroundColor: color,
          textColor: color,
          secondaryTextColor: color,
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
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid hex colors', () => {
      INVALID_COLORS.forEach((color) => {
        const result = bioPageThemeConfigSchema.safeParse({
          primaryColor: color,
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
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('fontSize validation', () => {
    it('should accept valid font sizes', () => {
      const validSizes = ['16px', '1rem', '18em'];
      validSizes.forEach((size) => {
        const result = bioPageThemeConfigSchema.safeParse({
          primaryColor: '#000000',
          secondaryColor: '#000000',
          backgroundColor: '#000000',
          textColor: '#000000',
          secondaryTextColor: '#000000',
          fontFamily: 'Arial',
          fontSize: { base: size, heading: size, small: size },
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
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid font sizes', () => {
      const invalidSizes = ['16', 'rem', '1.5empx', '1.5.5rem'];
      invalidSizes.forEach((size) => {
        const result = bioPageThemeConfigSchema.safeParse({
          primaryColor: '#000000',
          secondaryColor: '#000000',
          backgroundColor: '#000000',
          textColor: '#000000',
          secondaryTextColor: '#000000',
          fontFamily: 'Arial',
          fontSize: { base: size, heading: '16px', small: '14px' },
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
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('enum validation', () => {
    it('should accept valid spacing values', () => {
      const spacings = ['compact', 'normal', 'relaxed'];
      spacings.forEach((spacing) => {
        const result = bioPageThemeConfigSchema.safeParse({
          primaryColor: '#000000',
          secondaryColor: '#000000',
          backgroundColor: '#000000',
          textColor: '#000000',
          secondaryTextColor: '#000000',
          fontFamily: 'Arial',
          fontSize: { base: '16px', heading: '24px', small: '14px' },
          fontWeight: { normal: 400, medium: 500, bold: 700 },
          spacing,
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
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid spacing values', () => {
      const result = bioPageThemeConfigSchema.safeParse({
        primaryColor: '#000000',
        secondaryColor: '#000000',
        backgroundColor: '#000000',
        textColor: '#000000',
        secondaryTextColor: '#000000',
        fontFamily: 'Arial',
        fontSize: { base: '16px', heading: '24px', small: '14px' },
        fontWeight: { normal: 400, medium: 500, bold: 700 },
        spacing: 'invalid',
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
      });
      expect(result.success).toBe(false);
    });
  });

  describe('backgroundGradient validation', () => {
    it('should accept valid gradient config', () => {
      const result = bioPageThemeConfigSchema.safeParse({
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
        backgroundType: 'gradient',
        backgroundGradient: {
          type: 'linear',
          direction: '45deg',
          colors: ['#000000', '#FFFFFF', '#FF0000'],
        },
      });
      expect(result.success).toBe(true);
    });

    it('should reject gradient with less than 2 colors', () => {
      const result = bioPageThemeConfigSchema.safeParse({
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
        backgroundType: 'gradient',
        backgroundGradient: {
          type: 'linear',
          colors: ['#000000'],
        },
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('bioPageUpdateSchema', () => {
  it('should accept partial updates', () => {
    const result = bioPageUpdateSchema.safeParse({
      title: 'Updated Title',
    });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = bioPageUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept multiple fields', () => {
    const result = bioPageUpdateSchema.safeParse({
      title: 'Updated Title',
      slug: 'updated-slug',
      isActive: false,
    });
    expect(result.success).toBe(true);
  });
});

describe('bioPageVisibilitySchema', () => {
  it('should accept isActive: true', () => {
    const result = bioPageVisibilitySchema.safeParse({
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it('should accept isActive: false', () => {
    const result = bioPageVisibilitySchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing isActive', () => {
    const result = bioPageVisibilitySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject non-boolean isActive', () => {
    const result = bioPageVisibilitySchema.safeParse({
      isActive: 'true',
    });
    expect(result.success).toBe(false);
  });
});
