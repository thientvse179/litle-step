import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './progress-store';

function resetStore() {
  const today = new Date().toISOString().split('T')[0];
  useProgressStore.setState({
    hydrated: true,
    progress: {
      version: 2,
      totalStars: 0,
      totalDaysCompleted: 0,
      dailyProgress: {
        date: today,
        completedMissionIds: [],
        dailyRewardClaimed: false,
      },
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
    },
  });
}

function unlockItem(itemId: string) {
  const state = useProgressStore.getState();
  useProgressStore.setState({
    progress: {
      ...state.progress,
      unlockedItemIds: [...state.progress.unlockedItemIds, itemId],
    },
  });
}

describe('Equipment Actions — equipRoomItem', () => {
  beforeEach(() => {
    resetStore();
  });

  it('succeeds with valid unlocked item in correct slot', () => {
    unlockItem('rug-rainbow');
    const result = useProgressStore.getState().equipRoomItem({
      slotId: 'floor-rug',
      itemId: 'rug-rainbow',
    });
    expect(result.status).toBe('equipped');
    expect(useProgressStore.getState().progress.roomLayout['floor-rug']).toBe('rug-rainbow');
  });

  it('rejects item not unlocked', () => {
    const result = useProgressStore.getState().equipRoomItem({
      slotId: 'floor-rug',
      itemId: 'rug-rainbow',
    });
    expect(result.status).toBe('invalid');
  });

  it('rejects item in wrong slot', () => {
    unlockItem('rug-rainbow');
    const result = useProgressStore.getState().equipRoomItem({
      slotId: 'bed',
      itemId: 'rug-rainbow',
    });
    expect(result.status).toBe('invalid');
  });
});

describe('Equipment Actions — clearRoomSlot', () => {
  beforeEach(() => {
    resetStore();
  });

  it('removes the item from the slot', () => {
    unlockItem('rug-rainbow');
    useProgressStore.getState().equipRoomItem({ slotId: 'floor-rug', itemId: 'rug-rainbow' });
    useProgressStore.getState().clearRoomSlot('floor-rug');
    expect(useProgressStore.getState().progress.roomLayout['floor-rug']).toBeUndefined();
  });
});

describe('Equipment Actions — equipAccessory', () => {
  beforeEach(() => {
    resetStore();
    useProgressStore.getState().selectCharacter('rabbit-cloud');
  });

  it('succeeds with valid unlocked accessory', () => {
    unlockItem('hat-adventure');
    const result = useProgressStore.getState().equipAccessory('hat-adventure');
    expect(result.status).toBe('equipped');
  });

  it('rejects non-accessory item', () => {
    unlockItem('rug-rainbow');
    const result = useProgressStore.getState().equipAccessory('rug-rainbow');
    expect(result.status).toBe('invalid');
  });
});

describe('Equipment Actions — removeAccessory', () => {
  beforeEach(() => {
    resetStore();
    useProgressStore.getState().selectCharacter('rabbit-cloud');
  });

  it('removes accessory from equipped list', () => {
    unlockItem('hat-adventure');
    useProgressStore.getState().equipAccessory('hat-adventure');
    useProgressStore.getState().removeAccessory('hat-adventure');
    expect(useProgressStore.getState().progress.equippedAccessoryItemIds).not.toContain('hat-adventure');
  });
});
