'use client';

import * as React from 'react';
import { PreviewContent } from './preview-content';
import { ThemeInjector } from './theme-injector';

interface PreviewFrameProps {
  width: number;
  height: number;
  themeCSS: string;
  bioPage: {
    title: string;
    description: string;
    avatarUrl: string;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    description?: string;
    iconUrl?: string;
    imageUrl?: string;
    themeConfig?: Record<string, unknown>;
  }>;
  onLinkClick?: (linkId: string) => void;
}

export const PreviewFrame = React.forwardRef<HTMLDivElement, PreviewFrameProps>(
  ({ width, height, themeCSS, bioPage, links, onLinkClick }, ref) => {
    const frameRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => mergedRef.current!);

    React.useEffect(() => {
      if (frameRef.current) {
        frameRef.current.style.width = `${width}px`;
        frameRef.current.style.height = `${height}px`;
      }
    }, [width, height]);

    return (
      <div
        ref={mergedRef}
        className="preview-frame mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <ThemeInjector css={themeCSS} />
        <PreviewContent
          bioPage={bioPage}
          links={links}
          onLinkClick={onLinkClick}
        />
      </div>
    );
  }
);

PreviewFrame.displayName = 'PreviewFrame';
