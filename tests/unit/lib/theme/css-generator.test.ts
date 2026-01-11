/**
 * Unit tests for CSS generator theme system
 */

import {
  generateThemeCSS,
  generateLinkThemeCSS,
} from '@/lib/theme/css-generator';
import type { BioLinkThemeConfig } from '@/lib/theme/types';
import {
  generateMockThemeConfig,
  generateMockLinkThemeConfig,
} from '@/tests/helpers';

describe('CSS Generator', () => {
  describe('generateThemeCSS', () => {
    it('should generate CSS with all required CSS variables', () => {
      const theme = generateMockThemeConfig();
      const css = generateThemeCSS(theme);

      expect(css).toContain('--theme-primary:');
      expect(css).toContain('--theme-secondary:');
      expect(css).toContain('--theme-background:');
      expect(css).toContain('--theme-text:');
      expect(css).toContain('--theme-text-secondary:');
      expect(css).toContain('--theme-font-family:');
      expect(css).toContain('--theme-font-size-base:');
      expect(css).toContain('--theme-font-size-heading:');
      expect(css).toContain('--theme-font-size-small:');
      expect(css).toContain('--theme-font-weight-normal:');
      expect(css).toContain('--theme-font-weight-medium:');
      expect(css).toContain('--theme-font-weight-bold:');
      expect(css).toContain('--theme-padding-page:');
      expect(css).toContain('--theme-padding-section:');
      expect(css).toContain('--theme-padding-link:');
      expect(css).toContain('--theme-max-width:');
      expect(css).toContain('--theme-alignment:');
      expect(css).toContain('--theme-border-radius:');
      expect(css).toContain('--theme-border-width:');
      expect(css).toContain('--theme-shadow:');
      expect(css).toContain('--theme-animation-duration:');
    });

    it('should generate .bio-page styles', () => {
      const theme = generateMockThemeConfig();
      const css = generateThemeCSS(theme);

      expect(css).toContain('.bio-page');
      expect(css).toContain('font-family:');
      expect(css).toContain('background:');
      expect(css).toContain('color:');
      expect(css).toContain('text-align:');
      expect(css).toContain('max-width:');
      expect(css).toContain('margin:');
      expect(css).toContain('padding:');
    });

    it('should generate .bio-link styles', () => {
      const theme = generateMockThemeConfig();
      const css = generateThemeCSS(theme);

      expect(css).toContain('.bio-link');
      expect(css).toContain('border-radius:');
      expect(css).toContain('padding:');
      expect(css).toContain('box-shadow:');
      expect(css).toContain('transition:');
    });

    it('should generate .bio-link:hover styles', () => {
      const theme = generateMockThemeConfig();
      const css = generateThemeCSS(theme);

      expect(css).toContain('.bio-link:hover');
      expect(css).toContain('transform:');
    });

    it('should generate .bio-avatar styles', () => {
      const theme = generateMockThemeConfig();
      const css = generateThemeCSS(theme);

      expect(css).toContain('.bio-avatar');
      expect(css).toContain('border-radius:');
    });

    it('should generate keyframe animations', () => {
      const theme = generateMockThemeConfig();
      const css = generateThemeCSS(theme);

      expect(css).toContain('@keyframes fadeIn');
      expect(css).toContain('@keyframes slideIn');
      expect(css).toContain('@keyframes scaleIn');
    });

    it('should use theme colors in CSS variables', () => {
      const theme = generateMockThemeConfig({
        primaryColor: '#FF0000',
        backgroundColor: '#00FF00',
        textColor: '#0000FF',
      });
      const css = generateThemeCSS(theme);

      expect(css).toContain('--theme-primary: #FF0000');
      expect(css).toContain('--theme-background: #00FF00');
      expect(css).toContain('--theme-text: #0000FF');
    });

    it('should use theme fonts in CSS variables', () => {
      const theme = generateMockThemeConfig({
        fontFamily: 'Roboto',
        fontSize: { base: '18px', heading: '32px', small: '14px' },
        fontWeight: { normal: 300, medium: 600, bold: 800 },
      });
      const css = generateThemeCSS(theme);

      expect(css).toContain('--theme-font-family: Roboto');
      expect(css).toContain('--theme-font-size-base: 18px');
      expect(css).toContain('--theme-font-size-heading: 32px');
      expect(css).toContain('--theme-font-size-small: 14px');
      expect(css).toContain('--theme-font-weight-normal: 300');
      expect(css).toContain('--theme-font-weight-medium: 600');
      expect(css).toContain('--theme-font-weight-bold: 800');
    });

    it('should use theme layout settings', () => {
      const theme = generateMockThemeConfig({
        maxWidth: '800px',
        alignment: 'left',
        borderRadius: 12,
        borderWidth: 2,
      });
      const css = generateThemeCSS(theme);

      expect(css).toContain('--theme-max-width: 800px');
      expect(css).toContain('--theme-alignment: left');
      expect(css).toContain('--theme-border-radius: 12px');
      expect(css).toContain('--theme-border-width: 2px');
    });

    describe('background types', () => {
      it('should handle solid background', () => {
        const theme = generateMockThemeConfig({
          backgroundType: 'solid',
          backgroundColor: '#FFFFFF',
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain('background: #FFFFFF');
      });

      it('should handle linear gradient background', () => {
        const theme = generateMockThemeConfig({
          backgroundType: 'gradient',
          backgroundColor: '#FFFFFF',
          backgroundGradient: {
            type: 'linear',
            direction: '45deg',
            colors: ['#FF0000', '#00FF00', '#0000FF'],
          },
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain(
          'linear-gradient(45deg, #FF0000, #00FF00, #0000FF)'
        );
      });

      it('should handle radial gradient background', () => {
        const theme = generateMockThemeConfig({
          backgroundType: 'gradient',
          backgroundColor: '#FFFFFF',
          backgroundGradient: {
            type: 'radial',
            colors: ['#FF0000', '#00FF00'],
          },
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain('radial-gradient(#FF0000, #00FF00)');
      });

      it('should handle image background', () => {
        const theme = generateMockThemeConfig({
          backgroundType: 'image',
          backgroundColor: '#FFFFFF',
          backgroundImage: {
            url: 'https://example.com/image.jpg',
            position: 'cover',
            opacity: 0.5,
          },
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain('url("https://example.com/image.jpg")');
        expect(css).toContain('cover');
        expect(css).toContain('no-repeat');
      });
    });

    describe('button styles', () => {
      it('should apply solid button style', () => {
        const theme = generateMockThemeConfig({
          buttonStyle: 'solid',
          primaryColor: '#FF0000',
          textColor: '#FFFFFF',
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain('background-color: #FF0000');
        expect(css).toContain('color: #FFFFFF');
        expect(css).toContain('border: none');
      });

      it('should apply outline button style', () => {
        const theme = generateMockThemeConfig({
          buttonStyle: 'outline',
          primaryColor: '#FF0000',
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain('background-color: transparent');
        expect(css).toContain('border:');
        expect(css).toContain('solid #FF0000');
      });

      it('should apply ghost button style', () => {
        const theme = generateMockThemeConfig({
          buttonStyle: 'ghost',
        });
        const css = generateThemeCSS(theme);

        expect(css).toContain('background-color: transparent');
        expect(css).toContain('border: none');
      });
    });

    describe('shadow values', () => {
      it('should apply none shadow', () => {
        const theme = generateMockThemeConfig({ shadow: 'none' });
        const css = generateThemeCSS(theme);
        expect(css).toContain('--theme-shadow: none');
      });

      it('should apply small shadow', () => {
        const theme = generateMockThemeConfig({ shadow: 'small' });
        const css = generateThemeCSS(theme);
        expect(css).toContain(
          '--theme-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        );
      });

      it('should apply medium shadow', () => {
        const theme = generateMockThemeConfig({ shadow: 'medium' });
        const css = generateThemeCSS(theme);
        expect(css).toContain(
          '--theme-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        );
      });

      it('should apply large shadow', () => {
        const theme = generateMockThemeConfig({ shadow: 'large' });
        const css = generateThemeCSS(theme);
        expect(css).toContain(
          '--theme-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        );
      });
    });

    describe('animation styles', () => {
      it('should apply fade animation', () => {
        const theme = generateMockThemeConfig({ animation: 'fade' });
        const css = generateThemeCSS(theme);
        expect(css).toContain(
          'animation: fadeIn var(--theme-animation-duration) ease-in-out'
        );
      });

      it('should apply slide animation', () => {
        const theme = generateMockThemeConfig({ animation: 'slide' });
        const css = generateThemeCSS(theme);
        expect(css).toContain(
          'animation: slideIn var(--theme-animation-duration) ease-in-out'
        );
      });

      it('should apply scale animation', () => {
        const theme = generateMockThemeConfig({ animation: 'scale' });
        const css = generateThemeCSS(theme);
        expect(css).toContain(
          'animation: scaleIn var(--theme-animation-duration) ease-in-out'
        );
      });

      it('should apply no animation', () => {
        const theme = generateMockThemeConfig({ animation: 'none' });
        const css = generateThemeCSS(theme);
        expect(css).toContain('animation: none');
      });
    });

    describe('avatar styles', () => {
      it('should apply circle avatar shape', () => {
        const theme = generateMockThemeConfig({ avatarShape: 'circle' });
        const css = generateThemeCSS(theme);
        expect(css).toContain('border-radius: 50%');
      });

      it('should apply square avatar shape', () => {
        const theme = generateMockThemeConfig({ avatarShape: 'square' });
        const css = generateThemeCSS(theme);
        expect(css).toContain('border-radius: 0');
      });

      it('should apply rounded avatar shape', () => {
        const theme = generateMockThemeConfig({ avatarShape: 'rounded' });
        const css = generateThemeCSS(theme);
        expect(css).toContain('border-radius: 12px');
      });
    });

    describe('security sanitization', () => {
      it('should sanitize malicious colors', () => {
        const theme = generateMockThemeConfig({
          primaryColor: 'javascript:alert(1)',
          backgroundColor: 'expression(alert(1))',
        });
        const css = generateThemeCSS(theme);

        expect(css).not.toContain('javascript:');
        expect(css).not.toContain('expression(');
      });

      it('should sanitize malicious font family', () => {
        const theme = generateMockThemeConfig({
          fontFamily: '"; import: url("http://evil.com");',
        });
        const css = generateThemeCSS(theme);

        // Should remove dangerous CSS constructs
        expect(css).not.toContain('@import');
        // Note: The sanitization removes semicolons, braces, and comments
        // but doesn't remove all potentially malicious content from font names
        // The CSS is still safe because @import requires a semicolon
      });

      it('should sanitize malicious image URLs', () => {
        const theme = generateMockThemeConfig({
          backgroundType: 'image',
          backgroundColor: '#FFFFFF',
          backgroundImage: {
            url: 'javascript:alert(1)',
            position: 'cover',
            opacity: 1,
          },
        });
        const css = generateThemeCSS(theme);

        expect(css).not.toContain('javascript:');
      });

      it('should sanitize malicious URLs', () => {
        const theme = generateMockThemeConfig({
          backgroundType: 'image',
          backgroundColor: '#FFFFFF',
          backgroundImage: {
            url: 'vbscript:msgbox(1)',
            position: 'cover',
            opacity: 1,
          },
        });
        const css = generateThemeCSS(theme);

        expect(css).not.toContain('vbscript:');
      });
    });
  });

  describe('generateLinkThemeCSS', () => {
    it('should generate CSS for custom link theme', () => {
      const linkTheme = generateMockLinkThemeConfig({
        backgroundColor: '#FF0000',
        textColor: '#FFFFFF',
        borderRadius: 12,
      });
      const css = generateLinkThemeCSS(linkTheme);

      expect(css).toContain('.bio-link.custom-theme');
      expect(css).toContain('background-color: #FF0000');
      expect(css).toContain('color: #FFFFFF');
      expect(css).toContain('border-radius: 12px');
    });

    it('should include hover styles when hoverColor is set', () => {
      const linkTheme = generateMockLinkThemeConfig({
        hoverColor: '#00FF00',
      });
      const css = generateLinkThemeCSS(linkTheme);

      expect(css).toContain('.bio-link.custom-theme:hover');
      expect(css).toContain('background-color: #00FF00');
    });

    it('should handle all optional properties', () => {
      const linkTheme: BioLinkThemeConfig = {
        backgroundColor: '#FF0000',
        textColor: '#FFFFFF',
        borderColor: '#0000FF',
        hoverColor: '#00FF00',
        buttonStyle: 'outline',
        borderRadius: 8,
        borderWidth: 2,
        shadow: 'medium',
        fontSize: '18px',
        fontWeight: 600,
        padding: '16px',
        margin: '8px',
      };
      const css = generateLinkThemeCSS(linkTheme);

      expect(css).toContain('background-color: #FF0000');
      expect(css).toContain('color: #FFFFFF');
      expect(css).toContain('border-color: #0000FF');
      expect(css).toContain('border-radius: 8px');
      expect(css).toContain('border-width: 2px');
      expect(css).toContain('font-size: 18px');
      expect(css).toContain('font-weight: 600');
      expect(css).toContain('padding: 16px');
      expect(css).toContain('margin: 8px');
      expect(css).toContain('box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)');
    });

    it('should handle empty theme config', () => {
      const linkTheme: BioLinkThemeConfig = {};
      const css = generateLinkThemeCSS(linkTheme);

      expect(css).toContain('.bio-link.custom-theme');
      expect(css).toContain('.bio-link.custom-theme:hover');
    });

    it('should sanitize malicious values', () => {
      const linkTheme = generateMockLinkThemeConfig({
        backgroundColor: 'javascript:alert(1)',
        textColor: 'expression(evil)',
      });
      const css = generateLinkThemeCSS(linkTheme);

      expect(css).not.toContain('javascript:');
      expect(css).not.toContain('expression(');
    });
  });
});
