'use client';

import { useEffect, useRef, useCallback, useState, useId } from 'react';
import { YouTubePlayerAdapter } from '@/lib/youtube';
import type { PlayerState } from '@/lib/youtube';

interface YouTubePlayerProps {
  videoId: string;
  onStateChange?: (state: PlayerState) => void;
  onError?: () => void;
}

export function YouTubePlayer({ videoId, onStateChange, onError }: YouTubePlayerProps) {
  const adapterRef = useRef<YouTubePlayerAdapter | null>(null);
  const containerId = useId();
  const stableContainerId = `yt-player-${containerId.replace(/:/g, '')}`;
  const [loadError, setLoadError] = useState(false);

  const handleError = useCallback(() => {
    setLoadError(true);
    onError?.();
  }, [onError]);

  useEffect(() => {
    const adapter = new YouTubePlayerAdapter();
    adapterRef.current = adapter;

    adapter.initialize({
      videoId,
      containerId: stableContainerId,
      events: {
        onReady: () => onStateChange?.('ready'),
        onStateChange: (state) => onStateChange?.(state),
        onError: () => handleError(),
      },
    }).catch(() => handleError());

    return () => {
      adapter.destroy();
    };
  }, [videoId, onStateChange, handleError, stableContainerId]);

  if (loadError) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center p-4">
        <p className="text-center text-text-secondary text-sm">
          Không thể tải video. Hãy kiểm tra kết nối mạng và thử lại.
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900">
      <div id={stableContainerId} className="w-full h-full" />
    </div>
  );
}
