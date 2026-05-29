'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { YouTubePlayerAdapter } from '@/lib/youtube';
import type { PlayerState } from '@/lib/youtube';

interface YouTubePlayerProps {
  videoId: string;
  onStateChange?: (state: PlayerState) => void;
  onError?: () => void;
}

export function YouTubePlayer({ videoId, onStateChange, onError }: YouTubePlayerProps) {
  const reactId = useId();
  const containerId = `yt-player-${reactId.replace(/:/g, '')}`;
  const [loadError, setLoadError] = useState(false);

  // Keep callbacks in refs so the player effect runs only when videoId changes
  const onStateChangeRef = useRef(onStateChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let cancelled = false;
    const adapter = new YouTubePlayerAdapter();

    function handleFailure() {
      if (cancelled) return;
      setLoadError(true);
      onErrorRef.current?.();
    }

    adapter
      .initialize({
        videoId,
        containerId,
        events: {
          onReady: () => onStateChangeRef.current?.('ready'),
          onStateChange: (state) => onStateChangeRef.current?.(state),
          onError: () => handleFailure(),
        },
      })
      .catch(() => handleFailure());

    return () => {
      cancelled = true;
      adapter.destroy();
    };
  }, [videoId, containerId]);

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
      <div id={containerId} className="w-full h-full" />
    </div>
  );
}
