export interface BioPageThemeConfig {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;

  // Typography
  fontFamily: string;
  fontSize: {
    base: string;
    heading: string;
    small: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    bold: number;
  };

  // Spacing
  spacing: 'compact' | 'normal' | 'relaxed';
  padding: {
    page: string;
    section: string;
    link: string;
  };

  // Layout
  layout: 'vertical' | 'grid';
  maxWidth: string;
  alignment: 'left' | 'center' | 'right';

  // Button/Link Styling
  buttonStyle: 'solid' | 'outline' | 'ghost';
  borderRadius: number;
  borderWidth: number;
  shadow: 'none' | 'small' | 'medium' | 'large';

  // Avatar
  avatarShape: 'circle' | 'square' | 'rounded';
  avatarSize: 'small' | 'medium' | 'large';

  // Animations
  animation: 'none' | 'fade' | 'slide' | 'scale';
  animationDuration: string;

  // Background
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundGradient?: {
    type: 'linear' | 'radial';
    direction?: string;
    colors: string[];
  };
  backgroundImage?: {
    url: string;
    position: 'cover' | 'contain' | 'center';
    opacity: number;
  };
}

export interface BioLinkThemeConfig {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  borderRadius?: number;
  borderWidth?: number;
  shadow?: 'none' | 'small' | 'medium' | 'large';
  fontSize?: string;
  fontWeight?: number;
  padding?: string;
  margin?: string;
  iconPosition?: 'left' | 'right' | 'none';
  iconSize?: 'small' | 'medium' | 'large';
  showImage?: boolean;
  imagePosition?: 'left' | 'right' | 'background';
  imageSize?: 'small' | 'medium' | 'large';
}
