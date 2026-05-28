'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getMissionById } from '@/data/missions';
import { getItemById } from '@/data/items';
import { isConfiguredVideoId } from '@/lib/validation/schemas';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, PrimaryButton, SecondaryButton, ParentNote } from '@/components/kid-ui';
import { YouTubePlayer } from '@/components/mission/youtube-player';
import type { PlayerState } from '@/lib/youtube';

export default function MissionPage() {
  return (
    <HydrationGuard>
      <MissionContent />
    </HydrationGuard>
  );
}

type MissionPhase = 'intro' | 'playing' | 'ended' | 'confirming';

function MissionContent() {
  const params = useParams();
  const router = useRouter();
  const { completeMission, progress } = useProgressStore();
  const missionId = params.missionId as string;

  const [phase, setPhase] = useState<MissionPhase>('intro');
  const [playerState, setPlayerState] = useState<PlayerState>('unstarted');

  const handleStateChange = useCallback((state: PlayerState) => {
    setPlayerState(state);
    if (state === 'ended') {
      setPhase('ended');
    }
  }, []);

  const mission = getMissionById(missionId);

  if (!mission) {
    return (
      <PageShell className="items-center justify-center text-center">
        <p className="text-3xl mb-2">❓</p>
        <p className="font-semibold">Không tìm thấy nhiệm vụ</p>
        <div className="mt-4">
          <SecondaryButton onClick={() => router.push('/')}>
            Về nhà
          </SecondaryButton>
        </div>
      </PageShell>
    );
  }

  const isAlreadyCompleted = progress.completedMissions.some(
    (c) => c.missionId === missionId
  );
  const hasValidVideo = isConfiguredVideoId(mission.youtubeVideoId);
  const rewardItem = getItemById(mission.rewardItemId);

  const handleConfirmCompletion = () => {
    const result = completeMission({ missionId, videoEnded: true });
    if (result.status === 'awarded' || result.status === 'already-completed') {
      router.push(`/reward/${missionId}`);
    }
  };

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <PageShell>
        <button
          onClick={() => router.back()}
          className="self-start text-sm text-text-secondary min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Quay lại
        </button>

        <div className="text-center mb-4">
          <p className="text-sm text-text-secondary">
            Buổi {mission.dayNumber}
          </p>
          <h1 className="text-xl font-bold mt-1">{mission.kidTitle}</h1>
        </div>

        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
          <p className="text-text-secondary text-sm mb-3">{mission.story}</p>
          <div className="flex items-center gap-2 text-sm">
            <span>⏱️ ~{mission.durationMinutes} phút</span>
            <span>⭐ +{mission.rewardStars} sao</span>
          </div>
          {rewardItem && (
            <p className="text-sm mt-2">🎁 Phần thưởng: {rewardItem.name}</p>
          )}
        </div>

        <ParentNote>{mission.parentSafetyNote}</ParentNote>

        {!hasValidVideo ? (
          <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 text-center">
            <p className="text-sm text-orange-800 font-medium">
              ⚠️ Video chưa được cấu hình
            </p>
            <p className="text-xs text-orange-700 mt-1">
              Phụ huynh cần thay video ID trong file cấu hình trước khi bé tập.
            </p>
          </div>
        ) : isAlreadyCompleted ? (
          <div className="text-center py-2">
            <p className="text-sm text-success font-medium">
              ✅ Đã hoàn thành nhiệm vụ này
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Con có thể xem lại video nhưng không nhận thêm quà.
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-4 flex flex-col gap-3">
          <PrimaryButton
            disabled={!hasValidVideo}
            onClick={() => setPhase('playing')}
          >
            Bắt đầu
          </PrimaryButton>
          <SecondaryButton onClick={() => router.push('/')}>
            Quay lại
          </SecondaryButton>
        </div>
      </PageShell>
    );
  }

  // PLAYING / ENDED PHASE
  return (
    <PageShell>
      <YouTubePlayer
        videoId={mission.youtubeVideoId}
        onStateChange={handleStateChange}
        onError={() => setPhase('intro')}
      />

      {/* Safety controls — sticky at bottom during playback */}
      <div className="sticky bottom-4 z-10 flex gap-3 bg-bg-primary/90 backdrop-blur-sm rounded-xl p-2">
        <SecondaryButton onClick={() => setPhase('intro')}>
          Con cần nghỉ
        </SecondaryButton>
        <SecondaryButton onClick={() => router.push('/')}>
          Dừng buổi tập
        </SecondaryButton>
      </div>

      {/* Status */}
      {playerState === 'playing' && (
        <p className="text-center text-sm text-text-secondary">
          Đang tập... Cố lên nào! 💪
        </p>
      )}

      {/* Completion */}
      {phase === 'ended' && !isAlreadyCompleted && (
        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm text-center">
          <p className="text-2xl mb-2">🎊</p>
          <p className="font-semibold">Con đã tập xong!</p>
          <p className="text-sm text-text-secondary mt-1">
            Bấm nhận quà để xem phần thưởng nhé
          </p>
          <div className="mt-3">
            <PrimaryButton onClick={handleConfirmCompletion}>
              Nhận quà
            </PrimaryButton>
          </div>
        </div>
      )}

      {phase === 'ended' && isAlreadyCompleted && (
        <div className="text-center py-4">
          <p className="text-sm text-text-secondary">
            ✅ Con đã nhận quà cho nhiệm vụ này rồi. Giỏi lắm!
          </p>
          <div className="mt-3">
            <SecondaryButton onClick={() => router.push('/')}>
              Về nhà
            </SecondaryButton>
          </div>
        </div>
      )}
    </PageShell>
  );
}
