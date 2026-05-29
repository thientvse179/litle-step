'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getMissionById, getNextMission, getTotalMissions } from '@/data/missions';
import { isConfiguredVideoId } from '@/lib/validation/schemas';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, PrimaryButton, SecondaryButton, ParentNote } from '@/components/kid-ui';
import { YouTubePlayer } from '@/components/mission/youtube-player';
import { MissionCelebration } from '@/components/mission/mission-celebration';
import type { PlayerState } from '@/lib/youtube';
import type { DailyCompletionResult } from '@/types/domain';

export default function MissionPage() {
  return (
    <HydrationGuard>
      <MissionContent />
    </HydrationGuard>
  );
}

type MissionPhase = 'intro' | 'playing' | 'ended' | 'celebration';

function MissionContent() {
  const params = useParams();
  const router = useRouter();
  const { completeMission, progress } = useProgressStore();
  const missionId = params.missionId as string;

  const [phase, setPhase] = useState<MissionPhase>('intro');
  const [playerState, setPlayerState] = useState<PlayerState>('unstarted');
  const [lastResult, setLastResult] = useState<DailyCompletionResult | null>(null);

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
          <SecondaryButton onClick={() => router.push('/')}>Về nhà</SecondaryButton>
        </div>
      </PageShell>
    );
  }

  const isAlreadyDoneToday = progress.dailyProgress.completedMissionIds.includes(missionId);
  const currentReps = progress.dailyProgress.missionReps?.[missionId] ?? 0;
  const hasValidVideo = isConfiguredVideoId(mission.youtubeVideoId);
  const totalMissions = getTotalMissions();

  const handleConfirmCompletion = () => {
    const result = completeMission({ missionId, videoEnded: true });
    setLastResult(result);
    if (result.status !== 'invalid') {
      setPhase('celebration');
    }
  };

  // For celebration: figure out next mission
  const completedAfterThis = progress.dailyProgress.completedMissionIds.includes(missionId)
    ? progress.dailyProgress.completedMissionIds
    : [...progress.dailyProgress.completedMissionIds, missionId];
  const nextMission = getNextMission(completedAfterThis);
  const completedCount = completedAfterThis.length;
  const allDone = completedCount >= totalMissions;

  // CELEBRATION PHASE
  if (phase === 'celebration' && lastResult && lastResult.status !== 'invalid') {
    const missionFullyDone = lastResult.status === 'mission-completed' || lastResult.status === 'already-done';
    const starsEarned = lastResult.status === 'already-done' ? 0 : lastResult.starsAdded;

    return (
      <MissionCelebration
        mission={mission}
        starsEarned={starsEarned}
        repsNow={lastResult.status === 'rep-completed' ? lastResult.repsNow : undefined}
        repsRequired={lastResult.status === 'rep-completed' ? lastResult.repsRequired : undefined}
        missionFullyDone={missionFullyDone}
        completedCount={completedCount}
        totalMissions={totalMissions}
        nextMission={nextMission}
        allDoneToday={allDone && missionFullyDone}
        onRepeatMission={() => {
          setPhase('intro');
          setLastResult(null);
          setPlayerState('unstarted');
        }}
        onNextMission={() => {
          if (nextMission) {
            router.replace(`/mission/${nextMission.id}`);
          }
        }}
        onGoHome={() => router.push('/')}
        onClaimReward={() => router.push('/reward/daily')}
      />
    );
  }

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <PageShell>
        <button
          onClick={() => router.push('/')}
          className="self-start text-base font-display font-semibold text-accent min-h-[48px] min-w-[48px] flex items-center gap-1"
        >
          ← Về nhà
        </button>

        <div className="text-center mb-4">
          <p className="text-sm text-text-secondary">
            Bài {mission.order}/{totalMissions}
          </p>
          <h1 className="text-xl font-bold mt-1">{mission.kidTitle}</h1>
        </div>

        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
          <p className="text-text-secondary text-sm mb-3">{mission.story}</p>
          <div className="flex items-center gap-3 text-base font-display font-bold">
            <span>⏱️ ~{mission.durationMinutes} phút</span>
            <span className="text-amber-600">⭐ +{mission.rewardStars} sao</span>
          </div>

          {/* Rep progress */}
          {!isAlreadyDoneToday && currentReps > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-green-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full transition-all"
                  style={{ width: `${(currentReps / mission.requiredReps) * 100}%` }}
                />
              </div>
              <span className="text-sm font-display font-bold text-green-600">
                {currentReps}/{mission.requiredReps}
              </span>
            </div>
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
        ) : isAlreadyDoneToday ? (
          <div className="text-center py-2">
            <p className="text-sm text-success font-medium">
              ✅ Đã hoàn thành bài này hôm nay
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-4 flex flex-col gap-3">
          <PrimaryButton
            disabled={!hasValidVideo}
            onClick={() => setPhase('playing')}
          >
            {isAlreadyDoneToday
              ? 'Xem lại'
              : currentReps > 0
              ? `Tập lần ${currentReps + 1}/${mission.requiredReps} 💪`
              : 'Bắt đầu'}
          </PrimaryButton>
          <SecondaryButton onClick={() => router.push('/')}>
            ← Về nhà
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

      {/* Safety controls */}
      <div className="sticky bottom-4 z-10 flex gap-3 bg-bg-primary/90 backdrop-blur-sm rounded-xl p-2">
        <SecondaryButton onClick={() => setPhase('intro')}>
          Con cần nghỉ
        </SecondaryButton>
        <SecondaryButton onClick={() => router.push('/')}>
          ← Về nhà
        </SecondaryButton>
      </div>

      {playerState === 'playing' && (
        <p className="text-center text-sm text-text-secondary">
          Đang tập... Cố lên nào! 💪
        </p>
      )}

      {phase === 'ended' && !isAlreadyDoneToday && (
        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm text-center">
          <p className="text-3xl mb-2">🎊</p>
          <p className="font-display font-bold text-lg">Con đã tập xong!</p>
          <div className="mt-3">
            <PrimaryButton onClick={handleConfirmCompletion}>
              Nhận quà ⭐
            </PrimaryButton>
          </div>
        </div>
      )}

      {phase === 'ended' && isAlreadyDoneToday && (
        <div className="text-center py-4">
          <p className="text-sm text-text-secondary">
            ✅ Đã hoàn thành bài này hôm nay rồi!
          </p>
          <div className="mt-3">
            <SecondaryButton onClick={() => router.push('/')}>Về nhà</SecondaryButton>
          </div>
        </div>
      )}
    </PageShell>
  );
}
