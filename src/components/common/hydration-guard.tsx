'use client';

import { useProgressStore } from '@/stores/progress-store';

interface HydrationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const hydrated = useProgressStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      fallback ?? (
        <div className="flex-1 flex items-center justify-center min-h-dvh">
          <div className="text-center text-text-secondary">
            <p className="text-4xl mb-2">🏠</p>
            <p>Đang mở nhà nhỏ...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
