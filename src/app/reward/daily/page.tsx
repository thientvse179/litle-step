'use client';

import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getDailyReward, getItemById } from '@/data/items';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, PrimaryButton, SecondaryButton } from '@/components/kid-ui';
import { motion } from 'motion/react';

export default function DailyRewardPage() {
  return (
    <HydrationGuard>
      <DailyRewardContent />
    </HydrationGuard>
  );
}

function DailyRewardContent() {
  const router = useRouter();
  const { progress, claimDailyReward } = useProgressStore();

  const reward = getDailyReward(progress.totalDaysCompleted);
  const rewardItem = getItemById(reward.itemId);

  // If already claimed, show the result
  if (progress.dailyProgress.dailyRewardClaimed) {
    return (
      <PageShell className="items-center justify-center text-center">
        <motion.p
          className="text-7xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          🏆
        </motion.p>
        <motion.h1
          className="text-3xl font-extrabold mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tuyệt vời!
        </motion.h1>
        <motion.p
          className="text-text-secondary mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Con đã nhận quà hôm nay rồi. Hẹn ngày mai nhé!
        </motion.p>
        <motion.div
          className="mt-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <PrimaryButton onClick={() => router.push('/room')}>
            Trang trí phòng
          </PrimaryButton>
          <div className="mt-3">
            <SecondaryButton onClick={() => router.push('/')}>
              Về nhà
            </SecondaryButton>
          </div>
        </motion.div>
      </PageShell>
    );
  }

  // Claim the reward
  const handleClaim = () => {
    claimDailyReward();
  };

  return (
    <PageShell className="items-center justify-center text-center">
      {/* Big gift animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <p className="text-8xl">🎁</p>
      </motion.div>

      <motion.h1
        className="text-3xl font-extrabold mt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Quà to hôm nay!
      </motion.h1>

      <motion.p
        className="text-text-secondary mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Con đã tập xong tất cả bài. Mở quà thôi!
      </motion.p>

      {rewardItem && (
        <motion.div
          className="bg-bg-card rounded-[var(--radius-card)] p-5 shadow-md border-2 border-accent-soft mt-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-5xl mb-2">{getRewardEmoji(rewardItem.id)}</p>
          <p className="font-display font-extrabold text-xl">{rewardItem.name}</p>
          <p className="text-sm text-text-secondary mt-1">
            +{reward.bonusStars} sao bonus ⭐
          </p>
        </motion.div>
      )}

      <motion.div
        className="w-full mt-8 flex flex-col gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <PrimaryButton onClick={handleClaim}>
          🎉 Nhận quà
        </PrimaryButton>
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
