'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getCharacterById } from '@/data/characters';
import { getNextMission, getTotalMissions } from '@/data/missions';
import { getDailyReward, getItemById } from '@/data/items';
import { PageShell, PrimaryButton, StarsBadge } from '@/components/kid-ui';
import { RoomPreview } from '@/components/room/room-preview';
import { BottomNav } from '@/components/common/bottom-nav';

export function HomeDashboard() {
  const router = useRouter();
  const progress = useProgressStore((s) => s.progress);

  const character = getCharacterById(progress.selectedCharacterId!);
  const completedToday = progress.dailyProgress.completedMissionIds;
  const totalMissions = getTotalMissions();
  const nextMission = getNextMission(completedToday);
  const allDoneToday = completedToday.length >= totalMissions;
  const dailyReward = getDailyReward(progress.totalDaysCompleted);
  const dailyRewardItem = getItemById(dailyReward.itemId);

  if (!character) return null;

  return (
    <>
      <PageShell>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              {progress.childNickname
                ? `Xin chào, ${progress.childNickname}!`
                : 'Xin chào!'}
            </h1>
            <p className="text-sm text-text-secondary">
              Nhà của {character.name}
            </p>
          </div>
          <StarsBadge count={progress.totalStars} />
        </div>

        {/* Room Preview */}
        <RoomPreview compact />

        {/* Daily Progress */}
        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-bold text-base">Hôm nay</p>
            <p className="font-display font-extrabold text-accent tabular-nums">
              {completedToday.length}/{totalMissions}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-accent-soft/50 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${(completedToday.length / totalMissions) * 100}%` }}
            />
          </div>

          {/* Daily reward preview */}
          {dailyRewardItem && !progress.dailyProgress.dailyRewardClaimed && (
            <p className="text-sm text-text-secondary">
              🎁 Tập full hôm nay để nhận: <strong>{dailyRewardItem.name}</strong>
            </p>
          )}
        </div>

        {/* Next Mission or All Done */}
        {allDoneToday && !progress.dailyProgress.dailyRewardClaimed ? (
          <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm text-center">
            <p className="text-4xl mb-2">🎊</p>
            <p className="font-display font-bold text-lg">Tuyệt vời!</p>
            <p className="text-text-secondary text-sm mt-1">
              Con đã tập xong tất cả bài hôm nay!
            </p>
            <div className="mt-3">
              <PrimaryButton onClick={() => router.push('/reward/daily')}>
                Nhận quà to
              </PrimaryButton>
            </div>
          </div>
        ) : allDoneToday && progress.dailyProgress.dailyRewardClaimed ? (
          <div className="text-center py-4">
            <p className="text-4xl mb-2">🌟</p>
            <p className="font-display font-bold text-lg">Hoàn thành!</p>
            <p className="text-text-secondary text-sm mt-1">
              Con đã nhận quà hôm nay rồi. Hẹn gặp lại ngày mai nhé!
            </p>
          </div>
        ) : nextMission ? (
          <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
            <p className="text-sm text-text-secondary mb-1">
              Bài tiếp theo ({completedToday.length + 1}/{totalMissions})
            </p>
            <p className="font-display font-bold">{nextMission.kidTitle}</p>
            <p className="text-sm text-text-secondary mt-1">
              ⭐ +{nextMission.rewardStars} sao • ⏱️ ~{nextMission.durationMinutes} phút
            </p>
            <div className="mt-3">
              <PrimaryButton onClick={() => router.push(`/mission/${nextMission.id}`)}>
                Tập hôm nay
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {/* Stats */}
        <div className="flex gap-3 text-center">
          <div className="flex-1 bg-amber-50 rounded-xl p-3">
            <p className="font-display font-extrabold text-xl tabular-nums">{progress.totalStars}</p>
            <p className="text-xs text-text-secondary">Tổng sao</p>
          </div>
          <div className="flex-1 bg-green-50 rounded-xl p-3">
            <p className="font-display font-extrabold text-xl tabular-nums">{progress.totalDaysCompleted}</p>
            <p className="text-xs text-text-secondary">Ngày hoàn thành</p>
          </div>
        </div>

        {/* Parent entry - discreet */}
        <div className="mt-auto pb-2">
          <ParentEntry />
        </div>
      </PageShell>
      <BottomNav />
    </>
  );
}

function ParentEntry() {
  const router = useRouter();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startHold() {
    setHoldProgress(0);
    holdTimerRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          if (holdTimerRef.current) clearInterval(holdTimerRef.current);
          router.push('/parent');
          return 100;
        }
        return prev + 4;
      });
    }, 120);
  }

  function stopHold() {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setHoldProgress(0);
  }

  return (
    <div className="text-center pb-2">
      <button
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') startHold(); }}
        onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') stopHold(); }}
        className="text-xs text-text-secondary/60 py-2 px-4 min-h-[48px] select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
        aria-label="Khu vực bố mẹ - giữ 3 giây để mở"
      >
        👨‍👩‍👧 Bố mẹ
        {holdProgress > 0 && (
          <span className="ml-2 text-accent">
            {Math.min(Math.round(holdProgress), 100)}%
          </span>
        )}
      </button>
    </div>
  );
}
