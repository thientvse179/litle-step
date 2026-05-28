'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getMissionById } from '@/data/missions';
import { getItemById } from '@/data/items';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, PrimaryButton, SecondaryButton, StarsBadge } from '@/components/kid-ui';
import { motion } from 'motion/react';

export default function RewardPage() {
  return (
    <HydrationGuard>
      <RewardContent />
    </HydrationGuard>
  );
}

function RewardContent() {
  const params = useParams();
  const router = useRouter();
  const progress = useProgressStore((s) => s.progress);
  const missionId = params.missionId as string;

  const mission = getMissionById(missionId);
  const isCompleted = progress.completedMissions.some(
    (c) => c.missionId === missionId
  );

  if (!mission) {
    return (
      <PageShell className="items-center justify-center">
        <p>Không tìm thấy nhiệm vụ</p>
        <SecondaryButton onClick={() => router.push('/')}>Về nhà</SecondaryButton>
      </PageShell>
    );
  }

  const rewardItem = getItemById(mission.rewardItemId);

  if (!isCompleted) {
    return (
      <PageShell className="items-center justify-center text-center">
        <p className="text-3xl mb-2">🔒</p>
        <p className="font-semibold">Chưa hoàn thành nhiệm vụ này</p>
        <p className="text-sm text-text-secondary mt-1">
          Hãy tập xong video để nhận quà nhé!
        </p>
        <div className="mt-4">
          <SecondaryButton onClick={() => router.push(`/mission/${missionId}`)}>
            Đi tập
          </SecondaryButton>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <p className="text-5xl mb-4">🎉</p>
      </motion.div>

      <motion.h1
        className="text-2xl font-bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Giỏi lắm!
      </motion.h1>

      <motion.div
        className="mt-4 space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-center">
          <StarsBadge count={mission.rewardStars} className="text-lg" />
        </div>

        {rewardItem && (
          <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
            <p className="text-sm text-text-secondary mb-1">Vật phẩm mới</p>
            <p className="text-3xl mb-1">
              {getRewardEmoji(rewardItem.id)}
            </p>
            <p className="font-semibold">{rewardItem.name}</p>
          </div>
        )}
      </motion.div>

      <motion.div
        className="mt-8 w-full flex flex-col gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <PrimaryButton onClick={() => router.push('/room')}>
          Trang trí ngay
        </PrimaryButton>
        <SecondaryButton onClick={() => router.push('/')}>
          Về nhà
        </SecondaryButton>
      </motion.div>
    </PageShell>
  );
}

function getRewardEmoji(id: string): string {
  switch (id) {
    case 'rug-rainbow': return '🌈';
    case 'bed-cloud': return '🛏️';
    case 'lamp-star': return '💡';
    case 'window-magic': return '🪟';
    case 'plant-happy': return '🌱';
    case 'toy-treasure-chest': return '📦';
    case 'hat-adventure': return '🎩';
    default: return '🎁';
  }
}
