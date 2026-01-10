'use client';

import * as React from 'react';
import { useTheme } from '../theme-provider';
import { generateThemeCSS } from '@/lib/theme/css-generator';
import { PreviewFrame } from './preview-frame';
import { PreviewControls } from './preview-controls';
import { DeviceSelector } from './device-selector';

interface LivePreviewProps {
  bioPage: {
    id: string;
    title: string;
    description: string;
    avatarUrl: string;
    slug: string;
    links: Array<{
      id: string;
      title: string;
      url: string;
      description?: string;
      iconUrl?: string;
      imageUrl?: string;
      isActive: boolean;
      order: number;
      themeConfig?: Record<string, unknown>;
    }>;
  };
  onLinkClick?: (linkId: string) => void;
  editable?: boolean;
}

export function LivePreview({
  bioPage,
  onLinkClick,
  editable = true,
}: LivePreviewProps) {
  const { theme } = useTheme();
  const [device, setDevice] = React.useState<
    'mobile' | 'tablet' | 'desktop' | 'custom'
  >('desktop');
  const [customSize, setCustomSize] = React.useState({
    width: 600,
    height: 800,
  });
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const themeCSS = React.useMemo(() => generateThemeCSS(theme), [theme]);

  const activeLinks = React.useMemo(
    () =>
      bioPage.links
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order),
    [bioPage.links]
  );

  function getDeviceSize() {
    switch (device) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      case 'desktop':
        return { width: 1200, height: 800 };
      case 'custom':
        return customSize;
      default:
        return { width: 600, height: 800 };
    }
  }

  function handleRefresh() {
    if (previewRef.current) {
      previewRef.current.innerHTML = previewRef.current.innerHTML;
    }
  }

  function handleOpenInNewTab() {
    const url = `/p/${bioPage.slug}`;
    window.open(url, '_blank');
  }

  function handleCopyPreviewUrl() {
    const url = `${window.location.origin}/p/${bioPage.slug}`;
    navigator.clipboard.writeText(url);
  }

  function handleToggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  return (
    <div className={`live-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      {editable && (
        <PreviewControls
          onRefresh={handleRefresh}
          onOpenInNewTab={handleOpenInNewTab}
          onCopyUrl={handleCopyPreviewUrl}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleControls={() => setShowControls(!showControls)}
          isFullscreen={isFullscreen}
          showControls={showControls}
        />
      )}

      {editable && showControls && (
        <DeviceSelector
          device={device}
          onDeviceChange={setDevice}
          customSize={customSize}
          onCustomSizeChange={setCustomSize}
        />
      )}

      <PreviewFrame
        ref={previewRef}
        width={getDeviceSize().width}
        height={getDeviceSize().height}
        themeCSS={themeCSS}
        bioPage={bioPage}
        links={activeLinks}
        onLinkClick={onLinkClick}
      />
    </div>
  );
}
