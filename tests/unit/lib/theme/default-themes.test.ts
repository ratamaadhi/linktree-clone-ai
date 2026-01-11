/**
 * Unit tests for default theme presets
 */

import {
  defaultThemes,
  getDefaultTheme,
  getThemeByName,
} from '@/lib/theme/default-themes';

describe('Default Themes', () => {
  describe('defaultThemes array', () => {
    it('should have 5 default themes', () => {
      expect(defaultThemes).toHaveLength(5);
    });

    it('should include all expected theme names', () => {
      const themeNames = defaultThemes.map((theme) => theme.name);
      expect(themeNames).toContain('default');
      expect(themeNames).toContain('dark');
      expect(themeNames).toContain('pink');
      expect(themeNames).toContain('green');
      expect(themeNames).toContain('amber-grid');
    });

    it('should have valid theme configurations', () => {
      defaultThemes.forEach((theme) => {
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('primaryColor');
        expect(theme).toHaveProperty('secondaryColor');
        expect(theme).toHaveProperty('backgroundColor');
        expect(theme).toHaveProperty('textColor');
        expect(theme).toHaveProperty('secondaryTextColor');
        expect(theme).toHaveProperty('fontFamily');
        expect(theme).toHaveProperty('fontSize');
        expect(theme).toHaveProperty('fontWeight');
        expect(theme).toHaveProperty('spacing');
        expect(theme).toHaveProperty('padding');
        expect(theme).toHaveProperty('layout');
        expect(theme).toHaveProperty('maxWidth');
        expect(theme).toHaveProperty('alignment');
        expect(theme).toHaveProperty('buttonStyle');
        expect(theme).toHaveProperty('borderRadius');
        expect(theme).toHaveProperty('borderWidth');
        expect(theme).toHaveProperty('shadow');
        expect(theme).toHaveProperty('avatarShape');
        expect(theme).toHaveProperty('avatarSize');
        expect(theme).toHaveProperty('animation');
        expect(theme).toHaveProperty('animationDuration');
        expect(theme).toHaveProperty('backgroundType');
      });
    });

    it('should have valid hex colors', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

      defaultThemes.forEach((theme) => {
        expect(hexColorRegex.test(theme.primaryColor)).toBe(true);
        expect(hexColorRegex.test(theme.secondaryColor)).toBe(true);
        expect(hexColorRegex.test(theme.backgroundColor)).toBe(true);
        expect(hexColorRegex.test(theme.textColor)).toBe(true);
        expect(hexColorRegex.test(theme.secondaryTextColor)).toBe(true);

        // Check gradient colors if present
        if (theme.backgroundGradient) {
          theme.backgroundGradient.colors.forEach((color) => {
            expect(hexColorRegex.test(color)).toBe(true);
          });
        }
      });
    });

    it('should have valid font sizes with units', () => {
      const fontSizeRegex = /^\d+(px|rem|em)$/;

      defaultThemes.forEach((theme) => {
        expect(fontSizeRegex.test(theme.fontSize.base)).toBe(true);
        expect(fontSizeRegex.test(theme.fontSize.heading)).toBe(true);
        expect(fontSizeRegex.test(theme.fontSize.small)).toBe(true);

        expect(fontSizeRegex.test(theme.padding.page)).toBe(true);
        expect(fontSizeRegex.test(theme.padding.section)).toBe(true);
        expect(fontSizeRegex.test(theme.padding.link)).toBe(true);
      });
    });

    it('should have valid max width', () => {
      const maxWidthRegex = /^\d+(px|rem|em|%|vw|vh)$/;

      defaultThemes.forEach((theme) => {
        expect(maxWidthRegex.test(theme.maxWidth)).toBe(true);
      });
    });

    it('should have valid animation duration', () => {
      const animationDurationRegex = /^\d+(\.\d+)?s$/;

      defaultThemes.forEach((theme) => {
        expect(animationDurationRegex.test(theme.animationDuration)).toBe(true);
      });
    });

    it('should have valid font weights', () => {
      defaultThemes.forEach((theme) => {
        expect(theme.fontWeight.normal).toBeGreaterThanOrEqual(100);
        expect(theme.fontWeight.normal).toBeLessThanOrEqual(900);
        expect(theme.fontWeight.medium).toBeGreaterThanOrEqual(100);
        expect(theme.fontWeight.medium).toBeLessThanOrEqual(900);
        expect(theme.fontWeight.bold).toBeGreaterThanOrEqual(100);
        expect(theme.fontWeight.bold).toBeLessThanOrEqual(900);
      });
    });

    it('should have valid border radius and width', () => {
      defaultThemes.forEach((theme) => {
        expect(theme.borderRadius).toBeGreaterThanOrEqual(0);
        expect(theme.borderRadius).toBeLessThanOrEqual(50);
        expect(theme.borderWidth).toBeGreaterThanOrEqual(0);
        expect(theme.borderWidth).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('specific theme configurations', () => {
    it('should have default theme with correct settings', () => {
      const theme = defaultThemes.find((t) => t.name === 'default');
      expect(theme).toBeDefined();
      expect(theme?.primaryColor).toBe('#3b82f6');
      expect(theme?.backgroundColor).toBe('#ffffff');
      expect(theme?.buttonStyle).toBe('solid');
      expect(theme?.layout).toBe('vertical');
      expect(theme?.shadow).toBe('small');
    });

    it('should have dark theme with correct settings', () => {
      const theme = defaultThemes.find((t) => t.name === 'dark');
      expect(theme).toBeDefined();
      expect(theme?.backgroundColor).toBe('#111827');
      expect(theme?.textColor).toBe('#f9fafb');
      expect(theme?.buttonStyle).toBe('outline');
      expect(theme?.borderRadius).toBe(12);
    });

    it('should have pink theme with gradient', () => {
      const theme = defaultThemes.find((t) => t.name === 'pink');
      expect(theme).toBeDefined();
      expect(theme?.primaryColor).toBe('#ec4899');
      expect(theme?.backgroundType).toBe('gradient');
      expect(theme?.backgroundGradient).toBeDefined();
      expect(theme?.backgroundGradient?.type).toBe('linear');
      expect(theme?.buttonStyle).toBe('solid');
      expect(theme?.avatarShape).toBe('rounded');
    });

    it('should have green theme with relaxed spacing', () => {
      const theme = defaultThemes.find((t) => t.name === 'green');
      expect(theme).toBeDefined();
      expect(theme?.primaryColor).toBe('#10b981');
      expect(theme?.spacing).toBe('relaxed');
      expect(theme?.buttonStyle).toBe('ghost');
      expect(theme?.avatarSize).toBe('large');
    });

    it('should have amber-grid theme with grid layout', () => {
      const theme = defaultThemes.find((t) => t.name === 'amber-grid');
      expect(theme).toBeDefined();
      expect(theme?.primaryColor).toBe('#f59e0b');
      expect(theme?.layout).toBe('grid');
      expect(theme?.maxWidth).toBe('800px');
      expect(theme?.spacing).toBe('compact');
      expect(theme?.avatarShape).toBe('square');
      expect(theme?.backgroundType).toBe('gradient');
      expect(theme?.backgroundGradient?.type).toBe('radial');
    });
  });

  describe('getDefaultTheme', () => {
    it('should return the default theme', () => {
      const theme = getDefaultTheme();
      expect(theme).toBeDefined();
      expect(theme.name).toBe('default');
    });

    it('should return a valid BioPageThemeConfig', () => {
      const theme = getDefaultTheme();
      expect(theme.primaryColor).toBeDefined();
      expect(theme.backgroundColor).toBeDefined();
      expect(theme.fontFamily).toBeDefined();
      expect(theme.fontSize).toBeDefined();
    });
  });

  describe('getThemeByName', () => {
    it('should return theme by name', () => {
      const theme = getThemeByName('dark');
      expect(theme).toBeDefined();
      expect(theme?.name).toBe('dark');
    });

    it('should return undefined for non-existent theme', () => {
      const theme = getThemeByName('non-existent');
      expect(theme).toBeUndefined();
    });

    it('should find all default themes', () => {
      const defaultTheme = getThemeByName('default');
      const darkTheme = getThemeByName('dark');
      const pinkTheme = getThemeByName('pink');
      const greenTheme = getThemeByName('green');
      const amberGridTheme = getThemeByName('amber-grid');

      expect(defaultTheme).toBeDefined();
      expect(darkTheme).toBeDefined();
      expect(pinkTheme).toBeDefined();
      expect(greenTheme).toBeDefined();
      expect(amberGridTheme).toBeDefined();
    });
  });
});
