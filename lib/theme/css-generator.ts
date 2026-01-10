import type { BioPageThemeConfig, BioLinkThemeConfig } from './types';

function sanitizeCSSValue(value: string): string {
  if (typeof value !== 'string') return '';

  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/;/g, '')
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

function sanitizeURL(url: string): string {
  if (typeof url !== 'string') return '';

  const urlLower = url.toLowerCase();

  if (
    urlLower.startsWith('javascript:') ||
    urlLower.startsWith('vbscript:') ||
    urlLower.startsWith('data:text') ||
    urlLower.startsWith('data:html')
  ) {
    return '';
  }

  return url
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '')
    .replace(/\r/g, '');
}

function sanitizeColor(color: string): string {
  if (typeof color !== 'string') return '#000000';

  const colorLower = color.toLowerCase();

  if (
    colorLower.startsWith('expression(') ||
    colorLower.includes('javascript:') ||
    colorLower.includes('vbscript:')
  ) {
    return '#000000';
  }

  const colorRegex =
    /^(#[0-9a-f]{3,8}|rgb(a?)\s*\(\s*\d+%?\s*(,\s*\d+%?\s*){2}(,\s*[\d.]+\s*)?\)|hsl(a?)\s*\(\s*\d+%?\s*(,\s*\d+%\s*){2}(,\s*[\d.]+\s*)?\)|[a-z]+)$/i;

  if (colorRegex.test(color)) {
    return color;
  }

  return '#000000';
}

function sanitizeUnit(value: string): string {
  if (typeof value !== 'string') return '0px';

  return value.replace(/[^0-9.a-zA-Z-]/g, '').trim() || '0px';
}

export function generateThemeCSS(theme: BioPageThemeConfig): string {
  return `
    :root {
      /* Colors */
      --theme-primary: ${sanitizeColor(theme.primaryColor)};
      --theme-secondary: ${sanitizeColor(theme.secondaryColor)};
      --theme-background: ${sanitizeColor(theme.backgroundColor)};
      --theme-text: ${sanitizeColor(theme.textColor)};
      --theme-text-secondary: ${sanitizeColor(theme.secondaryTextColor)};

      /* Typography */
      --theme-font-family: ${sanitizeCSSValue(theme.fontFamily)};
      --theme-font-size-base: ${sanitizeUnit(theme.fontSize.base)};
      --theme-font-size-heading: ${sanitizeUnit(theme.fontSize.heading)};
      --theme-font-size-small: ${sanitizeUnit(theme.fontSize.small)};
      --theme-font-weight-normal: ${theme.fontWeight.normal};
      --theme-font-weight-medium: ${theme.fontWeight.medium};
      --theme-font-weight-bold: ${theme.fontWeight.bold};

      /* Spacing */
      --theme-padding-page: ${sanitizeUnit(theme.padding.page)};
      --theme-padding-section: ${sanitizeUnit(theme.padding.section)};
      --theme-padding-link: ${sanitizeUnit(theme.padding.link)};

      /* Layout */
      --theme-max-width: ${sanitizeUnit(theme.maxWidth)};
      --theme-alignment: ${theme.alignment};

      /* Border */
      --theme-border-radius: ${theme.borderRadius}px;
      --theme-border-width: ${theme.borderWidth}px;

      /* Shadow */
      --theme-shadow: ${getShadowValue(theme.shadow)};

      /* Animation */
      --theme-animation-duration: ${sanitizeUnit(theme.animationDuration)};
    }

    .bio-page {
      font-family: var(--theme-font-family);
      background: ${getBackgroundCSS(theme)};
      color: var(--theme-text);
      text-align: var(--theme-alignment);
      max-width: var(--theme-max-width);
      margin: 0 auto;
      padding: var(--theme-padding-page);
    }

    .bio-link {
      border-radius: var(--theme-border-radius);
      padding: var(--theme-padding-link);
      ${getButtonStyleCSS(theme.buttonStyle, theme.primaryColor, theme.textColor)}
      box-shadow: var(--theme-shadow);
      ${getAnimationCSS(theme.animation)}
      transition: all 0.2s ease;
    }

    .bio-link:hover {
      ${getHoverCSS(theme)}
    }

    .bio-avatar {
      border-radius: ${getAvatarRadius(theme.avatarShape)};
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;
}

export function generateLinkThemeCSS(linkTheme: BioLinkThemeConfig): string {
  return `
    .bio-link.custom-theme {
      ${linkTheme.backgroundColor ? `background-color: ${sanitizeColor(linkTheme.backgroundColor)};` : ''}
      ${linkTheme.textColor ? `color: ${sanitizeColor(linkTheme.textColor)};` : ''}
      ${linkTheme.borderColor ? `border-color: ${sanitizeColor(linkTheme.borderColor)};` : ''}
      ${linkTheme.borderRadius !== undefined ? `border-radius: ${linkTheme.borderRadius}px;` : ''}
      ${linkTheme.borderWidth !== undefined ? `border-width: ${linkTheme.borderWidth}px;` : ''}
      ${linkTheme.fontSize ? `font-size: ${sanitizeUnit(linkTheme.fontSize)};` : ''}
      ${linkTheme.fontWeight ? `font-weight: ${linkTheme.fontWeight};` : ''}
      ${linkTheme.padding ? `padding: ${sanitizeUnit(linkTheme.padding)};` : ''}
      ${linkTheme.margin ? `margin: ${sanitizeUnit(linkTheme.margin)};` : ''}
      ${linkTheme.shadow ? `box-shadow: ${getShadowValue(linkTheme.shadow)};` : ''}
    }

    .bio-link.custom-theme:hover {
      ${linkTheme.hoverColor ? `background-color: ${sanitizeColor(linkTheme.hoverColor)};` : ''}
    }
  `;
}

function getBackgroundCSS(theme: BioPageThemeConfig): string {
  switch (theme.backgroundType) {
    case 'gradient':
      if (theme.backgroundGradient) {
        const { type, direction, colors } = theme.backgroundGradient;
        const sanitizedColors = colors.map(sanitizeColor);
        if (type === 'linear') {
          return `linear-gradient(${direction || '45deg'}, ${sanitizedColors.join(', ')})`;
        } else {
          return `radial-gradient(${sanitizedColors.join(', ')})`;
        }
      }
      return sanitizeColor(theme.backgroundColor);
    case 'image':
      if (theme.backgroundImage) {
        return `
          url("${sanitizeURL(theme.backgroundImage.url)}") ${theme.backgroundImage.position} / cover no-repeat,
          ${sanitizeColor(theme.backgroundColor)}
        `;
      }
      return sanitizeColor(theme.backgroundColor);
    default:
      return sanitizeColor(theme.backgroundColor);
  }
}

function getButtonStyleCSS(
  style: 'solid' | 'outline' | 'ghost',
  primaryColor: string,
  textColor: string
): string {
  switch (style) {
    case 'solid':
      return `
        background-color: ${sanitizeColor(primaryColor)};
        color: ${sanitizeColor(textColor)};
        border: none;
      `;
    case 'outline':
      return `
        background-color: transparent;
        color: ${sanitizeColor(primaryColor)};
        border: var(--theme-border-width) solid ${sanitizeColor(primaryColor)};
      `;
    case 'ghost':
      return `
        background-color: transparent;
        color: ${sanitizeColor(textColor)};
        border: none;
      `;
  }
}

function getShadowValue(shadow: 'none' | 'small' | 'medium' | 'large'): string {
  switch (shadow) {
    case 'small':
      return '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    case 'medium':
      return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    case 'large':
      return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    default:
      return 'none';
  }
}

function getAnimationCSS(
  animation: 'none' | 'fade' | 'slide' | 'scale'
): string {
  switch (animation) {
    case 'fade':
      return 'animation: fadeIn var(--theme-animation-duration) ease-in-out;';
    case 'slide':
      return 'animation: slideIn var(--theme-animation-duration) ease-in-out;';
    case 'scale':
      return 'animation: scaleIn var(--theme-animation-duration) ease-in-out;';
    case 'none':
      return 'animation: none;';
    default:
      return 'animation: none;';
  }
}

function getHoverCSS(theme: BioPageThemeConfig): string {
  return `
    transform: translateY(-2px);
    box-shadow: ${getHoverShadow(theme.shadow)};
  `;
}

function getHoverShadow(shadow: 'none' | 'small' | 'medium' | 'large'): string {
  switch (shadow) {
    case 'small':
      return '0 2px 4px 0 rgba(0, 0, 0, 0.1)';
    case 'medium':
      return '0 6px 8px -1px rgba(0, 0, 0, 0.15), 0 3px 5px -1px rgba(0, 0, 0, 0.1)';
    case 'large':
      return '0 15px 20px -3px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1)';
    default:
      return 'none';
  }
}

function getAvatarRadius(shape: 'circle' | 'square' | 'rounded'): string {
  switch (shape) {
    case 'circle':
      return '50%';
    case 'square':
      return '0';
    case 'rounded':
      return '12px';
  }
}
