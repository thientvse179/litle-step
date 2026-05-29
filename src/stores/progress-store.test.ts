import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './progress-store';

function resetStore() {
  const today = new Date().toISOString().split('T')[0];
  useProgressStore.setState({
    hydrated: false,
    progress: {
      version: 2,
      totalStars: 0,
      totalDaysCompleted: 0,
      dailyProgress: {
        date: today,
        completedMissionIds: [],
        missionReps: {},
        dailyRewardClaimed: false,
      },
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
    },
  });
}

/** Helper: complete a mission fully (all 3 reps) */
function completeFullMission(missionId: string) {
  for (let i = 0; i < 3; i++) {
    useProgressStore.getState().completeMission({ missionId, videoEnded: true });
  }
}

describe('Progress Store — Daily Model with Reps', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('Initial state', () => {
    it('has version 2', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.version).toBe(2);
    });

    it('has 0 total stars', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.totalStars).toBe(0);
    });

    it('has empty daily progress', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.dailyProgress.completedMissionIds).toEqual([]);
      expect(progress.dailyProgress.missionReps).toEqual({});
    });
  });

  describe('selectCharacter', () => {
    it('sets the character ID', () => {
      useProgressStore.getState().selectCharacter('rabbit-cloud');
      expect(useProgressStore.getState().progress.selectedCharacterId).toBe('rabbit-cloud');
    });
  });

  describe('completeMission — rep system', () => {
    it('first rep returns rep-completed with 1/3', () => {
      const result = useProgressStore.getState().completeMission({
        missionId: 'mission-01',
        videoEnded: true,
      });
      expect(result.status).toBe('rep-completed');
      if (result.status === 'rep-completed') {
        expect(result.repsNow).toBe(1);
        expect(result.repsRequired).toBe(3);
        expect(result.starsAdded).toBe(1);
      }
    });

    it('second rep returns rep-completed with 2/3', () => {
      useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: true });
      const result = useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: true });
      expect(result.status).toBe('rep-completed');
      if (result.status === 'rep-completed') {
        expect(result.repsNow).toBe(2);
      }
    });

    it('third rep returns mission-completed', () => {
      useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: true });
      useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: true });
      const result = useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: true });
      expect(result.status).toBe('mission-completed');
    });

    it('after 3 reps, mission is in completedMissionIds', () => {
      completeFullMission('mission-01');
      const { progress } = useProgressStore.getState();
      expect(progress.dailyProgress.completedMissionIds).toContain('mission-01');
    });

    it('after full completion, further attempts return already-done', () => {
      completeFullMission('mission-01');
      const result = useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: true });
      expect(result.status).toBe('already-done');
    });

    it('accumulates stars across reps (1 per rep + bonus on completion)', () => {
      completeFullMission('mission-01'); // mission-01 has rewardStars: 1
      const { progress } = useProgressStore.getState();
      // 1 star per rep (2 reps) + rewardStars on final rep = 2 + 1 = 3
      expect(progress.totalStars).toBe(3);
    });

    it('rejects when videoEnded is false', () => {
      const result = useProgressStore.getState().completeMission({ missionId: 'mission-01', videoEnded: false });
      expect(result.status).toBe('invalid');
    });

    it('rejects invalid mission ID', () => {
      const result = useProgressStore.getState().completeMission({ missionId: 'non-existent', videoEnded: true });
      expect(result.status).toBe('invalid');
    });
  });

  describe('claimDailyReward', () => {
    it('returns not-ready if not all missions fully completed', () => {
      completeFullMission('mission-01');
      const result = useProgressStore.getState().claimDailyReward();
      expect(result.status).toBe('not-ready');
    });

    it('awards reward when all 7 missions fully completed', () => {
      for (let i = 1; i <= 7; i++) {
        completeFullMission(`mission-0${i}`);
      }
      const result = useProgressStore.getState().claimDailyReward();
      expect(result.status).toBe('awarded');
      if (result.status === 'awarded') {
        expect(result.starsAdded).toBeGreaterThan(0);
        expect(result.unlockedItemId).toBeTruthy();
      }
      const { progress } = useProgressStore.getState();
      expect(progress.dailyProgress.dailyRewardClaimed).toBe(true);
      expect(progress.totalDaysCompleted).toBe(1);
    });

    it('returns already-claimed on second call', () => {
      for (let i = 1; i <= 7; i++) {
        completeFullMission(`mission-0${i}`);
      }
      useProgressStore.getState().claimDailyReward();
      const result = useProgressStore.getState().claimDailyReward();
      expect(result.status).toBe('already-claimed');
    });
  });

  describe('resetProgress', () => {
    it('resets all progress', () => {
      useProgressStore.getState().selectCharacter('cat-star');
      completeFullMission('mission-01');
      useProgressStore.getState().resetProgress();

      const { progress } = useProgressStore.getState();
      expect(progress.selectedCharacterId).toBeUndefined();
      expect(progress.totalStars).toBe(0);
      expect(progress.totalDaysCompleted).toBe(0);
      expect(progress.dailyProgress.completedMissionIds).toEqual([]);
      expect(progress.dailyProgress.missionReps).toEqual({});
    });
  });
});
