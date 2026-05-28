import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CharacterId,
  ChildProgressState,
  CompletionResult,
  EquipResult,
  RoomSlotId,
} from '@/types/domain';
import { getMissionById } from '@/data/missions';
import { getItemById } from '@/data/items';
import { ChildProgressStateSchema } from '@/lib/validation/schemas';

const CURRENT_VERSION = 1;

function getDefaultProgress(): ChildProgressState {
  return {
    version: CURRENT_VERSION,
    totalStars: 0,
    completedMissions: [],
    unlockedItemIds: [],
    equippedAccessoryItemIds: [],
    roomLayout: {},
  };
}

interface ProgressStore {
  hydrated: boolean;
  progress: ChildProgressState;
  setHydrated: () => void;
  setNickname: (nickname?: string) => void;
  selectCharacter: (characterId: CharacterId) => void;
  completeMission: (input: { missionId: string; videoEnded: boolean }) => CompletionResult;
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
        const state = get();

        const mission = getMissionById(missionId);
        if (!mission || !mission.isActive) {
          return { status: 'invalid', reason: 'Mission not found or inactive' };
        }

        if (!videoEnded) {
          return { status: 'invalid', reason: 'Video has not ended' };
        }

        const alreadyCompleted = state.progress.completedMissions.some(
          (c) => c.missionId === missionId
        );
        if (alreadyCompleted) {
          return { status: 'already-completed', starsAdded: 0 };
        }

        const newCompletion = {
          missionId,
          completedAt: new Date().toISOString(),
          videoEnded: true,
        };

        const newUnlockedItemIds = [...state.progress.unlockedItemIds];
        if (!newUnlockedItemIds.includes(mission.rewardItemId)) {
          newUnlockedItemIds.push(mission.rewardItemId);
        }

        set({
          progress: {
            ...state.progress,
            totalStars: state.progress.totalStars + mission.rewardStars,
            completedMissions: [...state.progress.completedMissions, newCompletion],
            unlockedItemIds: newUnlockedItemIds,
          },
        });

        return {
          status: 'awarded',
          starsAdded: mission.rewardStars,
          unlockedItemId: mission.rewardItemId,
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
          // Validate persisted state
          const result = ChildProgressStateSchema.safeParse(state.progress);
          if (!result.success) {
            // Reset to default if corrupted
            state.progress = getDefaultProgress();
          }
          state.setHydrated();
        }
      },
    }
  )
);
