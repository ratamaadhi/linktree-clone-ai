'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor, Maximize2 } from 'lucide-react';

interface DeviceSelectorProps {
  device: 'mobile' | 'tablet' | 'desktop' | 'custom';
  onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop' | 'custom') => void;
  customSize: { width: number; height: number };
  onCustomSizeChange: (size: { width: number; height: number }) => void;
}

export function DeviceSelector({
  device,
  onDeviceChange,
  customSize,
  onCustomSizeChange,
}: DeviceSelectorProps) {
  const devices = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile', size: '375 × 667' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', size: '768 × 1024' },
    { id: 'desktop', icon: Monitor, label: 'Desktop', size: '1200 × 800' },
    {
      id: 'custom',
      icon: Maximize2,
      label: 'Custom',
      size: `${customSize.width} × ${customSize.height}`,
    },
  ];

  return (
    <div className="device-selector mb-4 flex flex-wrap gap-2">
      <div className="device-buttons flex gap-2">
        {devices.map((d) => {
          const Icon = d.icon;
          return (
            <Button
              key={d.id}
              variant={device === d.id ? 'default' : 'outline'}
              onClick={() =>
                onDeviceChange(
                  d.id as 'mobile' | 'tablet' | 'desktop' | 'custom'
                )
              }
              className="device-button"
            >
              <Icon className="h-4 w-4" />
              <span>{d.label}</span>
              <span className="device-size text-xs opacity-70">{d.size}</span>
            </Button>
          );
        })}
      </div>

      {device === 'custom' && (
        <div className="custom-size-controls flex items-center gap-4">
          <div className="size-input flex items-center gap-2">
            <label className="text-sm font-medium">Width</label>
            <input
              type="number"
              value={customSize.width}
              onChange={(e) =>
                onCustomSizeChange({
                  ...customSize,
                  width: Number(e.target.value),
                })
              }
              min={300}
              max={1920}
              step={10}
              className="w-20 rounded border px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-600">px</span>
          </div>
          <div className="size-input flex items-center gap-2">
            <label className="text-sm font-medium">Height</label>
            <input
              type="number"
              value={customSize.height}
              onChange={(e) =>
                onCustomSizeChange({
                  ...customSize,
                  height: Number(e.target.value),
                })
              }
              min={400}
              max={1200}
              step={10}
              className="w-20 rounded border px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-600">px</span>
          </div>
        </div>
      )}
    </div>
  );
}
