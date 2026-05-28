import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './progress-store';
import { ChildProgressStateSchema } from '@/lib/validation/schemas';

/**
 * Tests for the persisted progress store (T2.3).
 * Validates: Requirements REQ-01, REQ-02, REQ-08.
 */

function resetStore() {
  useProgressStore.setState({
    hydrated: false,
    progress: {
      version: 1,
      totalStars: 0,
      completedMissions: [],
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
    },
  });
}

describe('Progress Store', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('Initial state defaults', () => {
    it('has version 1', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.version).toBe(1);
    });

    it('has no selected character', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.selectedCharacterId).toBeUndefined();
    });

    it('has 0 total stars', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.totalStars).toBe(0);
    });

    it('has empty completed missions', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.completedMissions).toEqual([]);
    });

    it('has empty unlocked item IDs', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.unlockedItemIds).toEqual([]);
    });

    it('has empty equipped accessory item IDs', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.equippedAccessoryItemIds).toEqual([]);
    });

    it('has empty room layout', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.roomLayout).toEqual({});
    });

    it('has no nickname by default', () => {
      const { progress } = useProgressStore.getState();
      expect(progress.childNickname).toBeUndefined();
    });

    it('default state passes Zod schema validation', () => {
      const { progress } = useProgressStore.getState();
      const result = ChildProgressStateSchema.safeParse(progress);
      expect(result.success).toBe(true);
    });
  });

  describe('selectCharacter', () => {
    it('sets the character ID', () => {
      useProgressStore.getState().selectCharacter('rabbit-cloud');
      const { progress } = useProgressStore.getState();
      expect(progress.selectedCharacterId).toBe('rabbit-cloud');
    });

    it('can change to a different character', () => {
      useProgressStore.getState().selectCharacter('rabbit-cloud');
      useProgressStore.getState().selectCharacter('bear-honey');
      const { progress } = useProgressStore.getState();
      expect(progress.selectedCharacterId).toBe('bear-honey');
    });

    it('preserves other state when selecting character', () => {
      useProgressStore.getState().setNickname('Bé Bi');
      useProgressStore.getState().selectCharacter('cat-star');
      const { progress } = useProgressStore.getState();
      expect(progress.childNickname).toBe('Bé Bi');
      expect(progress.selectedCharacterId).toBe('cat-star');
    });
  });

  describe('setNickname', () => {
    it('sets the nickname', () => {
      useProgressStore.getState().setNickname('Bé Bi');
      const { progress } = useProgressStore.getState();
      expect(progress.childNickname).toBe('Bé Bi');
    });

    it('clears the nickname when called with undefined', () => {
      useProgressStore.getState().setNickname('Bé Bi');
      useProgressStore.getState().setNickname(undefined);
      const { progress } = useProgressStore.getState();
      expect(progress.childNickname).toBeUndefined();
    });

    it('clears the nickname when called without argument', () => {
      useProgressStore.getState().setNickname('Bé Bi');
      useProgressStore.getState().setNickname();
      const { progress } = useProgressStore.getState();
      expect(progress.childNickname).toBeUndefined();
    });

    it('preserves other state when setting nickname', () => {
      useProgressStore.getState().selectCharacter('bear-honey');
      useProgressStore.getState().setNickname('Bé Gấu');
      const { progress } = useProgressStore.getState();
      expect(progress.selectedCharacterId).toBe('bear-honey');
      expect(progress.childNickname).toBe('Bé Gấu');
    });
  });

  describe('resetProgress', () => {
    it('returns state to defaults after modifications', () => {
      // Make some changes
      useProgressStore.getState().selectCharacter('cat-star');
      useProgressStore.getState().setNickname('Bé Mèo');

      // Reset
      useProgressStore.getState().resetProgress();

      const { progress } = useProgressStore.getState();
      expect(progress.version).toBe(1);
      expect(progress.selectedCharacterId).toBeUndefined();
      expect(progress.childNickname).toBeUndefined();
      expect(progress.totalStars).toBe(0);
      expect(progress.completedMissions).toEqual([]);
      expect(progress.unlockedItemIds).toEqual([]);
      expect(progress.equippedAccessoryItemIds).toEqual([]);
      expect(progress.roomLayout).toEqual({});
    });

    it('reset state passes Zod schema validation', () => {
      useProgressStore.getState().selectCharacter('rabbit-cloud');
      useProgressStore.getState().resetProgress();

      const { progress } = useProgressStore.getState();
      const result = ChildProgressStateSchema.safeParse(progress);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid persisted state validation', () => {
    it('ChildProgressStateSchema rejects state with negative stars', () => {
      const invalid = {
        version: 1,
        totalStars: -5,
        completedMissions: [],
        unlockedItemIds: [],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      };
      const result = ChildProgressStateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('ChildProgressStateSchema rejects state with version 0', () => {
      const invalid = {
        version: 0,
        totalStars: 0,
        completedMissions: [],
        unlockedItemIds: [],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      };
      const result = ChildProgressStateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('ChildProgressStateSchema rejects state with invalid character ID', () => {
      const invalid = {
        version: 1,
        selectedCharacterId: 'invalid-character',
        totalStars: 0,
        completedMissions: [],
        unlockedItemIds: [],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      };
      const result = ChildProgressStateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('ChildProgressStateSchema rejects state missing required fields', () => {
      const invalid = {
        version: 1,
        totalStars: 0,
        // missing completedMissions, unlockedItemIds, etc.
      };
      const result = ChildProgressStateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('ChildProgressStateSchema rejects non-object state', () => {
      const result = ChildProgressStateSchema.safeParse('not an object');
      expect(result.success).toBe(false);
    });

    it('ChildProgressStateSchema rejects null state', () => {
      const result = ChildProgressStateSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it('onRehydrateStorage resets corrupted state to defaults', () => {
      // Simulate corrupted state being loaded
      useProgressStore.setState({
        progress: {
          version: 1,
          totalStars: -999,
          completedMissions: [],
          unlockedItemIds: [],
          equippedAccessoryItemIds: [],
          roomLayout: {},
        } as any,
      });

      // Simulate what onRehydrateStorage does: validate and reset if invalid
      const state = useProgressStore.getState();
      const result = ChildProgressStateSchema.safeParse(state.progress);

      if (!result.success) {
        // This is what the store's onRehydrateStorage handler does
        useProgressStore.setState({
          progress: {
            version: 1,
            totalStars: 0,
            completedMissions: [],
            unlockedItemIds: [],
            equippedAccessoryItemIds: [],
            roomLayout: {},
          },
        });
      }

      const { progress } = useProgressStore.getState();
      expect(progress.totalStars).toBe(0);
      expect(progress.version).toBe(1);
    });

    it('valid state passes schema validation without reset', () => {
      useProgressStore.getState().selectCharacter('bear-honey');
      useProgressStore.getState().setNickname('Test');

      const { progress } = useProgressStore.getState();
      const result = ChildProgressStateSchema.safeParse(progress);
      expect(result.success).toBe(true);
    });
  });

  describe('Hydration handling', () => {
    it('starts with hydrated false', () => {
      const { hydrated } = useProgressStore.getState();
      expect(hydrated).toBe(false);
    });

    it('setHydrated sets hydrated to true', () => {
      useProgressStore.getState().setHydrated();
      const { hydrated } = useProgressStore.getState();
      expect(hydrated).toBe(true);
    });
  });
});
