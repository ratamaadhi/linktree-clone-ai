import { pgEnum } from 'drizzle-orm/pg-core';

export const buttonStyleEnum = pgEnum('button_style', [
  'solid',
  'outline',
  'ghost',
]);

export const spacingEnum = pgEnum('spacing', [
  'compact',
  'normal',
  'relaxed',
]);

export const layoutEnum = pgEnum('layout', ['vertical', 'grid']);

export const deviceTypeEnum = pgEnum('device_type', [
  'desktop',
  'mobile',
  'tablet',
]);

export const animationEnum = pgEnum('animation', [
  'none',
  'fade',
  'slide',
  'scale',
]);

export const shadowEnum = pgEnum('shadow', [
  'none',
  'small',
  'medium',
  'large',
]);

export const avatarShapeEnum = pgEnum('avatar_shape', [
  'circle',
  'square',
  'rounded',
]);

export const avatarSizeEnum = pgEnum('avatar_size', [
  'small',
  'medium',
  'large',
]);

export const iconPositionEnum = pgEnum('icon_position', [
  'left',
  'right',
  'none',
]);

export const iconSizeEnum = pgEnum('icon_size', [
  'small',
  'medium',
  'large',
]);

export const imagePositionEnum = pgEnum('image_position', [
  'left',
  'right',
  'background',
]);

export const imageSizeEnum = pgEnum('image_size', [
  'small',
  'medium',
  'large',
]);

export const backgroundTypeEnum = pgEnum('background_type', [
  'solid',
  'gradient',
  'image',
]);

export const alignmentEnum = pgEnum('alignment', [
  'left',
  'center',
  'right',
]);

export const gradientTypeEnum = pgEnum('gradient_type', [
  'linear',
  'radial',
]);

export const bgPositionEnum = pgEnum('bg_position', [
  'cover',
  'contain',
  'center',
]);
