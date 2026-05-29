import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CharacterId,
  ChildProgressState,
  DailyCompletionResult,
  DailyRewardResult,
  EquipResult,
  RoomSlotId,
} from '@/types/domain';
import { getMissionById, missions } from '@/data/missions';
import { getItemById, getDailyReward } from '@/data/items';

const CURRENT_VERSION = 2;

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultProgress(): ChildProgressState {
  return {
    version: CURRENT_VERSION,
    totalStars: 0,
    totalDaysCompleted: 0,
    dailyProgress: {
      date: getTodayDate(),
      completedMissionIds: [],
      missionReps: {},
      dailyRewardClaimed: false,
    },
    unlockedItemIds: [],
    equippedAccessoryItemIds: [],
    roomLayout: {},
  };
}

/** Ensure daily progress is for today — reset if it's a new day */
function ensureTodayProgress(state: ChildProgressState): ChildProgressState {
  const today = getTodayDate();
  if (state.dailyProgress.date === today) {
    return state;
  }
  // New day — reset daily progress
  return {
    ...state,
    dailyProgress: {
      date: today,
      completedMissionIds: [],
      missionReps: {},
      dailyRewardClaimed: false,
    },
  };
}

interface ProgressStore {
  hydrated: boolean;
  progress: ChildProgressState;
  setHydrated: () => void;
  setNickname: (nickname?: string) => void;
  selectCharacter: (characterId: CharacterId) => void;
  completeMission: (input: { missionId: string; videoEnded: boolean }) => DailyCompletionResult;
  claimDailyReward: () => DailyRewardResult;
  equipRoomItem: (input: { slotId: RoomSlotId; itemId: string }) => EquipResult;
  clearRoomSlot: (slotId: RoomSlotId) => void;
  equipAccessory: (itemId: string) => EquipResult;
  removeAccessory: (itemId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      progress: getDefaultProgress(),

      setHydrated: () => set({ hydrated: true }),

      setNickname: (nickname?: string) =>
        set((state) => ({
          progress: { ...state.progress, childNickname: nickname },
        })),

      selectCharacter: (characterId: CharacterId) =>
        set((state) => ({
          progress: { ...state.progress, selectedCharacterId: characterId },
        })),

      completeMission: (input) => {
        const { missionId, videoEnded } = input;
        const currentState = get();
        const progress = ensureTodayProgress(currentState.progress);

        const mission = getMissionById(missionId);
        if (!mission || !mission.isActive) {
          return { status: 'invalid', reason: 'Mission not found or inactive' };
        }

        if (!videoEnded) {
          return { status: 'invalid', reason: 'Video has not ended' };
        }

        // Already fully completed today?
        if (progress.dailyProgress.completedMissionIds.includes(missionId)) {
          return { status: 'already-done' };
        }

        // Increment reps
        const currentReps = progress.dailyProgress.missionReps[missionId] ?? 0;
        const newReps = currentReps + 1;
        const newMissionReps = { ...progress.dailyProgress.missionReps, [missionId]: newReps };

        // Check if mission is now fully completed (all reps done)
        const isFullyDone = newReps >= mission.requiredReps;

        const newCompletedIds = isFullyDone
          ? [...progress.dailyProgress.completedMissionIds, missionId]
          : progress.dailyProgress.completedMissionIds;

        const starsForThisRep = isFullyDone ? mission.rewardStars : 1; // 1 star per rep, bonus on completion

        set({
          progress: {
            ...progress,
            totalStars: progress.totalStars + starsForThisRep,
            dailyProgress: {
              ...progress.dailyProgress,
              completedMissionIds: newCompletedIds,
              missionReps: newMissionReps,
            },
          },
        });

        if (isFullyDone) {
          return {
            status: 'mission-completed',
            starsAdded: starsForThisRep,
          };
        }

        return {
          status: 'rep-completed',
          repsNow: newReps,
          repsRequired: mission.requiredReps,
          starsAdded: starsForThisRep,
        };
      },

      claimDailyReward: () => {
        const currentState = get();
        const progress = ensureTodayProgress(currentState.progress);

        // Already claimed today?
        if (progress.dailyProgress.dailyRewardClaimed) {
          return { status: 'already-claimed' };
        }

        // Check if all missions completed today
        const activeMissionIds = missions.filter((m) => m.isActive).map((m) => m.id);
        const allDone = activeMissionIds.every((id) =>
          progress.dailyProgress.completedMissionIds.includes(id)
        );

        if (!allDone) {
          const remaining = activeMissionIds.length - progress.dailyProgress.completedMissionIds.length;
          return { status: 'not-ready', reason: `Còn ${remaining} bài nữa` };
        }

        // Award daily reward
        const reward = getDailyReward(progress.totalDaysCompleted);
        const item = getItemById(reward.itemId);
        if (!item) {
          return { status: 'not-ready', reason: 'Reward item not found' };
        }

        const newUnlockedItemIds = progress.unlockedItemIds.includes(reward.itemId)
          ? progress.unlockedItemIds
          : [...progress.unlockedItemIds, reward.itemId];

        set({
          progress: {
            ...progress,
            totalStars: progress.totalStars + reward.bonusStars,
            totalDaysCompleted: progress.totalDaysCompleted + 1,
            dailyProgress: {
              ...progress.dailyProgress,
              dailyRewardClaimed: true,
            },
            unlockedItemIds: newUnlockedItemIds,
          },
        });

        return {
          status: 'awarded',
          starsAdded: reward.bonusStars,
          unlockedItemId: reward.itemId,
        };
      },

      equipRoomItem: (input) => {
        const { slotId, itemId } = input;
        const state = get();

        const item = getItemById(itemId);
        if (!item) {
          return { status: 'invalid', reason: 'Item not found' };
        }

        if (item.type !== 'room-decoration') {
          return { status: 'invalid', reason: 'Item is not a room decoration' };
        }

        if (item.roomSlotId !== slotId) {
          return { status: 'invalid', reason: 'Item not compatible with this slot' };
        }

        if (!state.progress.unlockedItemIds.includes(itemId)) {
          return { status: 'invalid', reason: 'Item not unlocked' };
        }

        set({
          progress: {
            ...state.progress,
            roomLayout: { ...state.progress.roomLayout, [slotId]: itemId },
          },
        });

        return { status: 'equipped' };
      },

      clearRoomSlot: (slotId: RoomSlotId) =>
        set((state) => {
          const newLayout = { ...state.progress.roomLayout };
          delete newLayout[slotId];
          return { progress: { ...state.progress, roomLayout: newLayout } };
        }),

      equipAccessory: (itemId: string) => {
        const state = get();
        const item = getItemById(itemId);

        if (!item) {
          return { status: 'invalid', reason: 'Item not found' };
        }

        if (item.type !== 'character-accessory') {
          return { status: 'invalid', reason: 'Item is not an accessory' };
        }

        if (!state.progress.unlockedItemIds.includes(itemId)) {
          return { status: 'invalid', reason: 'Item not unlocked' };
        }

        if (
          item.compatibleCharacterIds &&
          state.progress.selectedCharacterId &&
          !item.compatibleCharacterIds.includes(state.progress.selectedCharacterId)
        ) {
          return { status: 'invalid', reason: 'Item not compatible with character' };
        }

        const newEquipped = state.progress.equippedAccessoryItemIds.includes(itemId)
          ? state.progress.equippedAccessoryItemIds
          : [...state.progress.equippedAccessoryItemIds, itemId];

        set({
          progress: { ...state.progress, equippedAccessoryItemIds: newEquipped },
        });

        return { status: 'equipped' };
      },

      removeAccessory: (itemId: string) =>
        set((state) => ({
          progress: {
            ...state.progress,
            equippedAccessoryItemIds: state.progress.equippedAccessoryItemIds.filter(
              (id) => id !== itemId
            ),
          },
        })),

      resetProgress: () =>
        set({ progress: getDefaultProgress() }),
    }),
    {
      name: 'little-steps-progress',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migration: if old state format or missing dailyProgress, reset
          if (!state.progress.dailyProgress || state.progress.version < 2) {
            const today = new Date().toISOString().split('T')[0];
            state.progress = {
              ...state.progress,
              version: 2,
              totalDaysCompleted: state.progress.totalDaysCompleted ?? 0,
              dailyProgress: {
                date: today,
                completedMissionIds: [],
                missionReps: {},
                dailyRewardClaimed: false,
              },
              unlockedItemIds: state.progress.unlockedItemIds ?? [],
              equippedAccessoryItemIds: state.progress.equippedAccessoryItemIds ?? [],
              roomLayout: state.progress.roomLayout ?? {},
            };
          }
          // Ensure daily progress is for today
          state.progress = ensureTodayProgress(state.progress);
          state.setHydrated();
        }
      },
    }
  )
);
