'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  ExternalLink,
  Copy,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface PreviewControlsProps {
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onCopyUrl: () => void;
  onToggleFullscreen: () => void;
  onToggleControls: () => void;
  isFullscreen: boolean;
  showControls: boolean;
}

export function PreviewControls({
  onRefresh,
  onOpenInNewTab,
  onCopyUrl,
  onToggleFullscreen,
  onToggleControls,
  isFullscreen,
  showControls,
}: PreviewControlsProps) {
  return (
    <div className="preview-controls mb-4 flex items-center justify-between px-2">
      <div className="controls-left flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          title="Refresh Preview"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenInNewTab}
          title="Open in New Tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopyUrl}
          title="Copy Preview URL"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div className="controls-right flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleControls}
          title={showControls ? 'Hide Controls' : 'Show Controls'}
        >
          {showControls ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
