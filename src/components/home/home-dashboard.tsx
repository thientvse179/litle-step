'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getCharacterById } from '@/data/characters';
import { getNextMission, missions } from '@/data/missions';
import { getItemById } from '@/data/items';
import { PageShell, PrimaryButton, SecondaryButton, StarsBadge } from '@/components/kid-ui';
import { RoomPreview } from '@/components/room/room-preview';

export function HomeDashboard() {
  const router = useRouter();
  const progress = useProgressStore((s) => s.progress);

  const character = getCharacterById(progress.selectedCharacterId!);
  const completedIds = progress.completedMissions.map((c) => c.missionId);
  const nextMission = getNextMission(completedIds);
  const allCompleted = completedIds.length >= missions.length;
  const rewardItem = nextMission ? getItemById(nextMission.rewardItemId) : undefined;

  if (!character) return null;

  return (
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

      {/* Progress */}
      <div className="text-center text-sm text-text-secondary">
        Đã hoàn thành {completedIds.length}/{missions.length} nhiệm vụ
      </div>

      {/* Next Mission or Completion */}
      {allCompleted ? (
        <div className="text-center py-4">
          <p className="text-3xl mb-2">🎉</p>
          <p className="font-semibold text-lg">Tuyệt vời!</p>
          <p className="text-text-secondary text-sm mt-1">
            Con đã hoàn thành tất cả nhiệm vụ. Căn phòng thật đẹp!
          </p>
        </div>
      ) : nextMission ? (
        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
          <p className="text-sm text-text-secondary mb-1">Nhiệm vụ tiếp theo</p>
          <p className="font-semibold">{nextMission.kidTitle}</p>
          {rewardItem && (
            <p className="text-sm text-text-secondary mt-1">
              🎁 Phần thưởng: {rewardItem.name}
            </p>
          )}
          <div className="mt-3">
            <PrimaryButton onClick={() => router.push(`/mission/${nextMission.id}`)}>
              Tập hôm nay
            </PrimaryButton>
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex gap-3 mt-auto pb-4">
        <SecondaryButton onClick={() => router.push('/room')}>
          Trang trí phòng
        </SecondaryButton>
        <SecondaryButton onClick={() => router.push('/wardrobe')}>
          Phụ kiện
        </SecondaryButton>
      </div>

      {/* Parent entry - discreet */}
      <ParentEntry />
    </PageShell>
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
