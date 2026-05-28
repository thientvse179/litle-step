'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useProgressStore } from '@/stores/progress-store';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { HomeDashboard } from '@/components/home/home-dashboard';

export default function HomePage() {
  return (
    <HydrationGuard>
      <HomeContent />
    </HydrationGuard>
  );
}

function HomeContent() {
  const router = useRouter();
  const progress = useProgressStore((s) => s.progress);

  useEffect(() => {
    if (!progress.selectedCharacterId) {
      router.replace('/onboarding');
    }
  }, [progress.selectedCharacterId, router]);

  if (!progress.selectedCharacterId) {
    return null;
  }

  return <HomeDashboard />;
}
