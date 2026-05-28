import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './progress-store';

/**
 * Tests for idempotent reward and equipment actions (T2.4).
 * Validates: Requirements REQ-05, REQ-06, REQ-07, NFR-05.
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

/** Helper: unlock an item by adding it to unlockedItemIds */
function unlockItem(itemId: string) {
  const state = useProgressStore.getState();
  useProgressStore.setState({
    progress: {
      ...state.progress,
      unlockedItemIds: [...state.progress.unlockedItemIds, itemId],
    },
  });
}

/** Helper: select a character */
function selectCharacter(characterId: 'rabbit-cloud' | 'bear-honey' | 'cat-star') {
  useProgressStore.getState().selectCharacter(characterId);
}

describe('Reward Actions — completeMission', () => {
  beforeEach(() => {
    resetStore();
  });

  it('awards stars and unlocks item on first completion', () => {
    const result = useProgressStore.getState().completeMission({
      missionId: 'mission-day-01',
      videoEnded: true,
    });

    expect(result.status).toBe('awarded');
    expect(result.starsAdded).toBe(2);
    if (result.status === 'awarded') {
      expect(result.unlockedItemId).toBe('rug-rainbow');
    }

    const { progress } = useProgressStore.getState();
    expect(progress.totalStars).toBe(2);
    expect(progress.unlockedItemIds).toContain('rug-rainbow');
    expect(progress.completedMissions).toHaveLength(1);
    expect(progress.completedMissions[0].missionId).toBe('mission-day-01');
    expect(progress.completedMissions[0].videoEnded).toBe(true);
  });

  it('returns already-completed on second call with no duplicate stars or items', () => {
    // First completion
    useProgressStore.getState().completeMission({
      missionId: 'mission-day-01',
      videoEnded: true,
    });

    const starsBefore = useProgressStore.getState().progress.totalStars;
    const itemsBefore = [...useProgressStore.getState().progress.unlockedItemIds];

    // Second completion attempt
    const result = useProgressStore.getState().completeMission({
      missionId: 'mission-day-01',
      videoEnded: true,
    });

    expect(result.status).toBe('already-completed');
    expect(result.starsAdded).toBe(0);

    const { progress } = useProgressStore.getState();
    expect(progress.totalStars).toBe(starsBefore);
    expect(progress.unlockedItemIds).toEqual(itemsBefore);
    expect(progress.completedMissions).toHaveLength(1);
  });

  it('rejects when videoEnded is false', () => {
    const result = useProgressStore.getState().completeMission({
      missionId: 'mission-day-01',
      videoEnded: false,
    });

    expect(result.status).toBe('invalid');
    if (result.status === 'invalid') {
      expect(result.reason).toContain('Video');
    }

    const { progress } = useProgressStore.getState();
    expect(progress.totalStars).toBe(0);
    expect(progress.completedMissions).toHaveLength(0);
    expect(progress.unlockedItemIds).toHaveLength(0);
  });

  it('rejects invalid mission ID', () => {
    const result = useProgressStore.getState().completeMission({
      missionId: 'non-existent-mission',
      videoEnded: true,
    });

    expect(result.status).toBe('invalid');
    if (result.status === 'invalid') {
      expect(result.reason).toContain('not found');
    }

    const { progress } = useProgressStore.getState();
    expect(progress.totalStars).toBe(0);
    expect(progress.completedMissions).toHaveLength(0);
  });
});

describe('Equipment Actions — equipRoomItem', () => {
  beforeEach(() => {
    resetStore();
  });

  it('succeeds with valid unlocked item in correct slot', () => {
    // Unlock the rug-rainbow item (slot: floor-rug)
    unlockItem('rug-rainbow');

    const result = useProgressStore.getState().equipRoomItem({
      slotId: 'floor-rug',
      itemId: 'rug-rainbow',
    });

    expect(result.status).toBe('equipped');

    const { progress } = useProgressStore.getState();
    expect(progress.roomLayout['floor-rug']).toBe('rug-rainbow');
  });

  it('rejects item not unlocked', () => {
    // Do NOT unlock the item
    const result = useProgressStore.getState().equipRoomItem({
      slotId: 'floor-rug',
      itemId: 'rug-rainbow',
    });

    expect(result.status).toBe('invalid');
    if (result.status === 'invalid') {
      expect(result.reason).toContain('not unlocked');
    }

    const { progress } = useProgressStore.getState();
    expect(progress.roomLayout['floor-rug']).toBeUndefined();
  });

  it('rejects item in wrong slot', () => {
    // Unlock rug-rainbow (belongs to floor-rug slot)
    unlockItem('rug-rainbow');

    // Try to equip it in the bed slot
    const result = useProgressStore.getState().equipRoomItem({
      slotId: 'bed',
      itemId: 'rug-rainbow',
    });

    expect(result.status).toBe('invalid');
    if (result.status === 'invalid') {
      expect(result.reason).toContain('not compatible');
    }

    const { progress } = useProgressStore.getState();
    expect(progress.roomLayout['bed']).toBeUndefined();
  });
});

describe('Equipment Actions — clearRoomSlot', () => {
  beforeEach(() => {
    resetStore();
  });

  it('removes the item from the slot', () => {
    // Unlock and equip an item first
    unlockItem('rug-rainbow');
    useProgressStore.getState().equipRoomItem({
      slotId: 'floor-rug',
      itemId: 'rug-rainbow',
    });

    // Verify it's equipped
    expect(useProgressStore.getState().progress.roomLayout['floor-rug']).toBe('rug-rainbow');

    // Clear the slot
    useProgressStore.getState().clearRoomSlot('floor-rug');

    const { progress } = useProgressStore.getState();
    expect(progress.roomLayout['floor-rug']).toBeUndefined();
  });
});

describe('Equipment Actions — equipAccessory', () => {
  beforeEach(() => {
    resetStore();
    selectCharacter('rabbit-cloud');
  });

  it('succeeds with valid unlocked accessory', () => {
    // hat-adventure is compatible with all characters
    unlockItem('hat-adventure');

    const result = useProgressStore.getState().equipAccessory('hat-adventure');

    expect(result.status).toBe('equipped');

    const { progress } = useProgressStore.getState();
    expect(progress.equippedAccessoryItemIds).toContain('hat-adventure');
  });

  it('rejects non-accessory item', () => {
    // rug-rainbow is a room-decoration, not an accessory
    unlockItem('rug-rainbow');

    const result = useProgressStore.getState().equipAccessory('rug-rainbow');

    expect(result.status).toBe('invalid');
    if (result.status === 'invalid') {
      expect(result.reason).toContain('not an accessory');
    }

    const { progress } = useProgressStore.getState();
    expect(progress.equippedAccessoryItemIds).not.toContain('rug-rainbow');
  });
});

describe('Equipment Actions — removeAccessory', () => {
  beforeEach(() => {
    resetStore();
    selectCharacter('rabbit-cloud');
  });

  it('removes accessory from equipped list', () => {
    // Unlock and equip
    unlockItem('hat-adventure');
    useProgressStore.getState().equipAccessory('hat-adventure');

    // Verify equipped
    expect(useProgressStore.getState().progress.equippedAccessoryItemIds).toContain('hat-adventure');

    // Remove
    useProgressStore.getState().removeAccessory('hat-adventure');

    const { progress } = useProgressStore.getState();
    expect(progress.equippedAccessoryItemIds).not.toContain('hat-adventure');
  });
});
