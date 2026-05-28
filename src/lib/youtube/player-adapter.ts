import { loadYouTubeAPI } from './loader';
import type { PlayerState, YouTubePlayerConfig, YTPlayerInstance } from './types';

function mapYTState(state: number): PlayerState {
  switch (state) {
    case -1: return 'unstarted';
    case 0: return 'ended';
    case 1: return 'playing';
    case 2: return 'paused';
    case 3: return 'loading';
    case 5: return 'ready';
    default: return 'unstarted';
  }
}

export class YouTubePlayerAdapter {
  private player: YTPlayerInstance | null = null;
  private destroyed = false;

  async initialize(config: YouTubePlayerConfig): Promise<void> {
    await loadYouTubeAPI();

    if (this.destroyed) return;

    if (!window.YT?.Player) {
      config.events?.onError?.(0);
      return;
    }

    this.player = new window.YT.Player(config.containerId, {
      videoId: config.videoId,
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        origin: window.location.origin,
        widget_referrer: window.location.href,
      },
      events: {
        onReady: () => {
          config.events?.onReady?.();
        },
        onStateChange: (event) => {
          const mappedState = mapYTState(event.data);
          config.events?.onStateChange?.(mappedState);
        },
        onError: (event) => {
          config.events?.onError?.(event.data);
        },
      },
    });
  }

  destroy(): void {
    this.destroyed = true;
    if (this.player) {
      try {
        this.player.destroy();
      } catch {
        // Player may already be destroyed
      }
      this.player = null;
    }
  }
}
