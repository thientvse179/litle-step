'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { PageShell, PrimaryButton, SecondaryButton } from '@/components/kid-ui';
import type { Mission } from '@/types/domain';

interface MissionCelebrationProps {
  mission: Mission;
  starsEarned: number;
  /** If rep-based: current rep / required reps */
  repsNow?: number;
  repsRequired?: number;
  /** Whether the mission is fully completed (all reps done) */
  missionFullyDone: boolean;
  completedCount: number;
  totalMissions: number;
  nextMission: Mission | undefined;
  allDoneToday: boolean;
  onRepeatMission: () => void;
  onNextMission: () => void;
  onGoHome: () => void;
  onClaimReward: () => void;
}

// Random celebration messages
const REP_MESSAGES = [
  { emoji: '💪', text: 'Cố lên nào!' },
  { emoji: '🔥', text: 'Tuyệt vời!' },
  { emoji: '⚡', text: 'Siêu giỏi!' },
  { emoji: '🌟', text: 'Xuất sắc!' },
  { emoji: '🦸', text: 'Con là siêu nhân!' },
  { emoji: '🚀', text: 'Bay cao nào!' },
  { emoji: '🎯', text: 'Chính xác!' },
  { emoji: '🌈', text: 'Đẹp lắm!' },
];

const MISSION_DONE_MESSAGES = [
  { emoji: '🎉', text: 'Hoàn thành rồi!' },
  { emoji: '🏆', text: 'Chiến thắng!' },
  { emoji: '👑', text: 'Con là nhà vô địch!' },
  { emoji: '🎊', text: 'Tuyệt vời quá!' },
  { emoji: '🌟', text: 'Ngôi sao sáng nhất!' },
  { emoji: '🦁', text: 'Dũng cảm lắm!' },
];

const CONFETTI_SETS = [
  ['🌟', '⭐', '✨', '🎉', '💫', '🌈', '🎊', '💖', '🦋'],
  ['🎈', '🎀', '🌸', '🍭', '🦄', '💝', '🌺', '🎵', '🍬'],
  ['🚀', '⚡', '🔥', '💎', '🏅', '🎯', '🌙', '☀️', '🌊'],
];

export function MissionCelebration({
  mission,
  starsEarned,
  repsNow,
  repsRequired,
  missionFullyDone,
  completedCount,
  totalMissions,
  nextMission,
  allDoneToday,
  onRepeatMission,
  onNextMission,
  onGoHome,
  onClaimReward,
}: MissionCelebrationProps) {
  // Deterministic "random" based on mission id + reps — stable per celebration instance
  const seed = mission.id.length + (repsNow ?? completedCount);
  const celebration = useMemo(() => {
    const messages = missionFullyDone ? MISSION_DONE_MESSAGES : REP_MESSAGES;
    const msgIndex = seed % messages.length;
    const confettiIndex = (seed + 3) % CONFETTI_SETS.length;
    const msg = messages[msgIndex];
    const confetti = CONFETTI_SETS[confettiIndex];
    const confettiVariants = confetti.map((_, i) => ({
      rotate: 180 + ((i * 47 + seed * 13) % 360),
      duration: 2.5 + ((i * 31 + seed) % 10) / 10,
    }));
    return { ...msg, confetti, confettiVariants };
  }, [missionFullyDone, seed]);

  return (
    <PageShell className="items-center justify-center text-center relative overflow-hidden">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {celebration.confetti.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-4xl"
            initial={{
              opacity: 0,
              y: -30,
              x: `${8 + i * 10}%`,
              rotate: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: [0, 1, 1, 0.5, 0],
              y: ['0%', '90%'],
              rotate: [0, celebration.confettiVariants[i].rotate],
              scale: [0.5, 1.2, 1],
            }}
            transition={{
              duration: celebration.confettiVariants[i].duration,
              delay: i * 0.12,
              ease: 'easeOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main celebration emoji — big bounce */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
      >
        <p className="text-7xl md:text-8xl">{celebration.emoji}</p>
      </motion.div>

      {/* Random celebration text */}
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold mt-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        {celebration.text}
      </motion.h1>

      <motion.div
        className="space-y-3 mt-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Stars earned */}
        {starsEarned > 0 && (
          <motion.div
            className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-full px-5 py-2.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', bounce: 0.6 }}
          >
            <span className="text-3xl">⭐</span>
            <span className="font-display font-extrabold text-3xl text-amber-700">
              +{starsEarned}
            </span>
          </motion.div>
        )}

        {/* Rep progress (if not fully done) */}
        {!missionFullyDone && repsNow !== undefined && repsRequired !== undefined && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-base text-text-secondary font-display font-bold">
              Lần {repsNow}/{repsRequired} — {mission.kidTitle}
            </p>
            <div className="w-40 mx-auto h-3 bg-green-100 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-green-400 rounded-full"
                initial={{ width: `${((repsNow - 1) / repsRequired) * 100}%` }}
                animate={{ width: `${(repsNow / repsRequired) * 100}%` }}
                transition={{ delay: 0.9, duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        {/* Daily progress (if mission fully done) */}
        {missionFullyDone && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-48 mx-auto h-3 bg-accent-soft/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: `${((completedCount - 1) / totalMissions) * 100}%` }}
                animate={{ width: `${(completedCount / totalMissions) * 100}%` }}
                transition={{ delay: 1, duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-text-secondary mt-2 font-display font-bold">
              {completedCount}/{totalMissions} bài hôm nay ✅
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        className="w-full mt-8 flex flex-col gap-3"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {!missionFullyDone ? (
          /* Still need more reps */
          <PrimaryButton onClick={onRepeatMission}>
            Tập lần tiếp! 💪
          </PrimaryButton>
        ) : allDoneToday ? (
          <PrimaryButton onClick={onClaimReward}>
            🎁 Nhận quà to
          </PrimaryButton>
        ) : nextMission ? (
          <PrimaryButton onClick={onNextMission}>
            Bài tiếp theo →
          </PrimaryButton>
        ) : null}
        <SecondaryButton onClick={onGoHome}>
          Về nhà
        </SecondaryButton>
      </motion.div>
    </PageShell>
  );
}
