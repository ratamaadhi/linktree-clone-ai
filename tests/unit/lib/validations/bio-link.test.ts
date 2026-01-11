/**
 * Unit tests for bio link validation schemas
 */

import {
  bioLinkSchema,
  bioLinkUpdateSchema,
  bioLinkVisibilitySchema,
  bioLinksReorderSchema,
  bioLinkThemeConfigSchema,
} from '@/lib/validations/bio-link';
import {
  VALID_COLORS,
  INVALID_COLORS,
  VALID_URLS,
  INVALID_URLS,
} from '@/tests/helpers';

describe('bioLinkSchema', () => {
  describe('title validation', () => {
    it('should accept valid titles', () => {
      const validTitles = [
        'My Link',
        'A',
        'X'.repeat(100),
        'Link with numbers 123',
        'Special-chars_here!',
      ];

      validTitles.forEach((title) => {
        const result = bioLinkSchema.safeParse({
          title,
          url: 'https://example.com',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject empty titles', () => {
      const result = bioLinkSchema.safeParse({
        title: '',
        url: 'https://example.com',
      });
      expect(result.success).toBe(false);
    });

    it('should reject titles longer than 100 characters', () => {
      const result = bioLinkSchema.safeParse({
        title: 'X'.repeat(101),
        url: 'https://example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('url validation', () => {
    it('should accept valid URLs', () => {
      VALID_URLS.forEach((url) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      INVALID_URLS.forEach((url) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should require url field', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    it('should accept valid descriptions', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
        description: 'A valid description',
      });
      expect(result.success).toBe(true);
    });

    it('should reject descriptions longer than 200 characters', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
        description: 'X'.repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it('should make description optional', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('iconUrl validation', () => {
    it('should accept valid URLs', () => {
      VALID_URLS.forEach((iconUrl) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url: 'https://example.com',
          iconUrl,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      INVALID_URLS.forEach((iconUrl) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url: 'https://example.com',
          iconUrl,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should make iconUrl optional', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('imageUrl validation', () => {
    it('should accept valid URLs', () => {
      VALID_URLS.forEach((imageUrl) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url: 'https://example.com',
          imageUrl,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      INVALID_URLS.forEach((imageUrl) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url: 'https://example.com',
          imageUrl,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should make imageUrl optional', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('isActive validation', () => {
    it('should accept boolean values', () => {
      const result1 = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
        isActive: true,
      });
      const result2 = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
        isActive: false,
      });
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it('should default to true', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe('order validation', () => {
    it('should accept valid order values', () => {
      const validOrders = [0, 1, 100, 9999];
      validOrders.forEach((order) => {
        const result = bioLinkSchema.safeParse({
          title: 'Test Link',
          url: 'https://example.com',
          order,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject negative order values', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
        order: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-integer order values', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
        order: 1.5,
      });
      expect(result.success).toBe(false);
    });

    it('should default to 0', () => {
      const result = bioLinkSchema.safeParse({
        title: 'Test Link',
        url: 'https://example.com',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.order).toBe(0);
      }
    });
  });
});

describe('bioLinkThemeConfigSchema', () => {
  describe('color validation', () => {
    it('should accept valid hex colors', () => {
      VALID_COLORS.forEach((color) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          backgroundColor: color,
          textColor: color,
          borderColor: color,
          hoverColor: color,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid hex colors', () => {
      INVALID_COLORS.forEach((color) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          backgroundColor: color,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should make all fields optional', () => {
      const result = bioLinkThemeConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('numeric validation', () => {
    it('should accept valid borderRadius values', () => {
      const validRadii = [0, 8, 25, 50];
      validRadii.forEach((borderRadius) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          borderRadius,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject borderRadius out of range', () => {
      const invalidRadii = [-1, 51, 100];
      invalidRadii.forEach((borderRadius) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          borderRadius,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid borderWidth values', () => {
      const validWidths = [0, 1, 5, 10];
      validWidths.forEach((borderWidth) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          borderWidth,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject borderWidth out of range', () => {
      const invalidWidths = [-1, 11, 20];
      invalidWidths.forEach((borderWidth) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          borderWidth,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid fontWeight values', () => {
      const validWeights = [100, 400, 500, 700, 900];
      validWeights.forEach((fontWeight) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          fontWeight,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject fontWeight out of range', () => {
      const invalidWeights = [99, 901, 1000];
      invalidWeights.forEach((fontWeight) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          fontWeight,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('size validation', () => {
    it('should accept valid font sizes', () => {
      const validSizes = ['16px', '1rem', '18em'];
      validSizes.forEach((fontSize) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          fontSize,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid font sizes', () => {
      const invalidSizes = ['16', 'rem', '1.5empx'];
      invalidSizes.forEach((fontSize) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          fontSize,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid padding values', () => {
      const validPaddings = ['12px', '1rem', '2em'];
      validPaddings.forEach((padding) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          padding,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid padding values', () => {
      const invalidPaddings = ['12', 'px', '1rempx'];
      invalidPaddings.forEach((padding) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          padding,
        });
        expect(result.success).toBe(false);
      });
    });

    it('should accept valid margin values', () => {
      const validMargins = ['8px', '0rem', '1em'];
      validMargins.forEach((margin) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          margin,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid margin values', () => {
      const invalidMargins = ['8', 'x', '1.1.1rem'];
      invalidMargins.forEach((margin) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          margin,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('enum validation', () => {
    it('should accept valid buttonStyle values', () => {
      const styles = ['solid', 'outline', 'ghost'];
      styles.forEach((buttonStyle) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          buttonStyle,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid shadow values', () => {
      const shadows = ['none', 'small', 'medium', 'large'];
      shadows.forEach((shadow) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          shadow,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid iconPosition values', () => {
      const positions = ['left', 'right', 'none'];
      positions.forEach((iconPosition) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          iconPosition,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid iconSize values', () => {
      const sizes = ['small', 'medium', 'large'];
      sizes.forEach((iconSize) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          iconSize,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid imagePosition values', () => {
      const positions = ['left', 'right', 'background'];
      positions.forEach((imagePosition) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          imagePosition,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid imageSize values', () => {
      const sizes = ['small', 'medium', 'large'];
      sizes.forEach((imageSize) => {
        const result = bioLinkThemeConfigSchema.safeParse({
          imageSize,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});

describe('bioLinkUpdateSchema', () => {
  it('should accept partial updates', () => {
    const result = bioLinkUpdateSchema.safeParse({
      title: 'Updated Title',
    });
    expect(result.success).toBe(true);
  });

  it('should accept empty object', () => {
    const result = bioLinkUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept multiple fields', () => {
    const result = bioLinkUpdateSchema.safeParse({
      title: 'Updated Title',
      url: 'https://updated.com',
      isActive: false,
      order: 5,
    });
    expect(result.success).toBe(true);
  });

  it('should allow updating theme config', () => {
    const result = bioLinkUpdateSchema.safeParse({
      themeConfig: {
        backgroundColor: '#FF0000',
        borderRadius: 12,
      },
    });
    expect(result.success).toBe(true);
  });
});

describe('bioLinkVisibilitySchema', () => {
  it('should accept isActive: true', () => {
    const result = bioLinkVisibilitySchema.safeParse({
      isActive: true,
    });
    expect(result.success).toBe(true);
  });

  it('should accept isActive: false', () => {
    const result = bioLinkVisibilitySchema.safeParse({
      isActive: false,
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing isActive', () => {
    const result = bioLinkVisibilitySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject non-boolean isActive', () => {
    const result = bioLinkVisibilitySchema.safeParse({
      isActive: 'true',
    });
    expect(result.success).toBe(false);
  });
});

describe('bioLinksReorderSchema', () => {
  it('should accept valid reorder data', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [
        { id: '550e8400-e29b-41d4-a716-446655440000', order: 0 },
        { id: '550e8400-e29b-41d4-a716-446655440001', order: 1 },
        { id: '550e8400-e29b-41d4-a716-446655440002', order: 2 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing links array', () => {
    const result = bioLinksReorderSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should accept empty links array', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [],
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUIDs', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [{ id: 'not-a-uuid', order: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative order values', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [{ id: '550e8400-e29b-41d4-a716-446655440000', order: -1 }],
    });
    expect(result.success).toBe(false);
  });

  it('should reject non-integer order values', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [{ id: '550e8400-e29b-41d4-a716-446655440000', order: 1.5 }],
    });
    expect(result.success).toBe(false);
  });

  it('should reject links with missing id', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [{ order: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it('should reject links with missing order', () => {
    const result = bioLinksReorderSchema.safeParse({
      links: [{ id: '550e8400-e29b-41d4-a716-446655440000' }],
    });
    expect(result.success).toBe(false);
  });
});
