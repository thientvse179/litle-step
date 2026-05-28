let apiLoadPromise: Promise<void> | null = null;

/**
 * Loads the YouTube IFrame Player API script once.
 * Returns a promise that resolves when the API is ready.
 */
export function loadYouTubeAPI(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  if (window.YT?.Player) {
    apiLoadPromise = Promise.resolve();
    return apiLoadPromise;
  }

  apiLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    const timeout = setTimeout(() => {
      reject(new Error('YouTube API load timeout'));
    }, 15000);

    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      apiLoadPromise = null;
      reject(new Error('Failed to load YouTube API'));
    };

    document.head.appendChild(script);
  });

  return apiLoadPromise;
}
