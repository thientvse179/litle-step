import { describe, it, expect } from 'vitest';
import {
  CharacterIdSchema,
  DifficultySchema,
  RoomSlotIdSchema,
  ItemTypeSchema,
  CharacterSchema,
  MissionSchema,
  ItemSchema,
  WorkoutCompletionSchema,
  ChildProgressStateSchema,
  isConfiguredVideoId,
} from './schemas';

// --- Valid seed data fixtures ---

const validCharacter = {
  id: 'rabbit-cloud' as const,
  name: 'Thỏ Mây',
  description: 'Bạn thỏ dễ thương sống trên mây',
  avatarSrc: '/assets/characters/rabbit-cloud.svg',
  roomBackgroundSrc: '/assets/rooms/room-rainbow.svg',
};

const validMission = {
  id: 'mission-day-01',
  dayNumber: 1,
  title: 'Ngày 1 - Khởi động nhẹ',
  kidTitle: 'Cùng nhảy nào!',
  story: 'Bạn thú muốn tập nhảy cùng con.',
  youtubeVideoId: 'dQw4w9WgXcQ',
  durationMinutes: 5,
  difficulty: 'easy' as const,
  rewardStars: 3,
  rewardItemId: 'rug-rainbow',
  parentSafetyNote: 'Bé nên tập ở nơi rộng.',
  isActive: true,
};

const validItem = {
  id: 'rug-rainbow',
  name: 'Thảm cầu vồng',
  type: 'room-decoration' as const,
  imageSrc: '/assets/items/rug-rainbow.svg',
  roomSlotId: 'floor-rug' as const,
  unlockSource: 'mission' as const,
  unlockMissionId: 'mission-day-01',
};

const validAccessoryItem = {
  id: 'hat-adventure',
  name: 'Mũ phiêu lưu',
  type: 'character-accessory' as const,
  imageSrc: '/assets/items/hat-adventure.svg',
  compatibleCharacterIds: ['rabbit-cloud' as const, 'bear-honey' as const],
  unlockSource: 'mission' as const,
  unlockMissionId: 'mission-day-02',
};

const validProgressState = {
  version: 1,
  childNickname: 'Bé Na',
  selectedCharacterId: 'bear-honey' as const,
  totalStars: 6,
  completedMissions: [
    { missionId: 'mission-day-01', completedAt: '2024-01-15T10:00:00Z', videoEnded: true },
    { missionId: 'mission-day-02', completedAt: '2024-01-16T10:00:00Z', videoEnded: true },
  ],
  unlockedItemIds: ['rug-rainbow', 'lamp-star'],
  equippedAccessoryItemIds: ['hat-adventure'],
  roomLayout: { 'floor-rug': 'rug-rainbow' },
};

// --- Tests ---

describe('CharacterIdSchema', () => {
  it('accepts valid character IDs', () => {
    expect(CharacterIdSchema.parse('rabbit-cloud')).toBe('rabbit-cloud');
    expect(CharacterIdSchema.parse('bear-honey')).toBe('bear-honey');
    expect(CharacterIdSchema.parse('cat-star')).toBe('cat-star');
  });

  it('rejects invalid character IDs', () => {
    expect(() => CharacterIdSchema.parse('dog-fire')).toThrow();
    expect(() => CharacterIdSchema.parse('')).toThrow();
    expect(() => CharacterIdSchema.parse(123)).toThrow();
  });
});

describe('DifficultySchema', () => {
  it('accepts valid difficulties', () => {
    expect(DifficultySchema.parse('easy')).toBe('easy');
    expect(DifficultySchema.parse('medium')).toBe('medium');
  });

  it('rejects invalid difficulties', () => {
    expect(() => DifficultySchema.parse('hard')).toThrow();
    expect(() => DifficultySchema.parse('')).toThrow();
  });
});

describe('RoomSlotIdSchema', () => {
  it('accepts all valid slot IDs', () => {
    const validSlots = ['floor-rug', 'bed', 'window', 'wall-art', 'lamp', 'plant', 'toy'];
    for (const slot of validSlots) {
      expect(RoomSlotIdSchema.parse(slot)).toBe(slot);
    }
  });

  it('rejects invalid slot IDs', () => {
    expect(() => RoomSlotIdSchema.parse('ceiling')).toThrow();
    expect(() => RoomSlotIdSchema.parse('')).toThrow();
  });
});

describe('ItemTypeSchema', () => {
  it('accepts valid item types', () => {
    expect(ItemTypeSchema.parse('room-decoration')).toBe('room-decoration');
    expect(ItemTypeSchema.parse('character-accessory')).toBe('character-accessory');
  });

  it('rejects invalid item types', () => {
    expect(() => ItemTypeSchema.parse('weapon')).toThrow();
  });
});

describe('CharacterSchema', () => {
  it('validates a correct character object', () => {
    const result = CharacterSchema.parse(validCharacter);
    expect(result).toEqual(validCharacter);
  });

  it('rejects character with missing name', () => {
    const { name, ...noName } = validCharacter;
    expect(() => CharacterSchema.parse(noName)).toThrow();
  });

  it('rejects character with empty name', () => {
    expect(() => CharacterSchema.parse({ ...validCharacter, name: '' })).toThrow();
  });

  it('rejects character with invalid id', () => {
    expect(() => CharacterSchema.parse({ ...validCharacter, id: 'unknown-pet' })).toThrow();
  });

  it('rejects character with missing avatarSrc', () => {
    const { avatarSrc, ...noAvatar } = validCharacter;
    expect(() => CharacterSchema.parse(noAvatar)).toThrow();
  });
});

describe('MissionSchema', () => {
  it('validates a correct mission object', () => {
    const result = MissionSchema.parse(validMission);
    expect(result).toEqual(validMission);
  });

  it('rejects mission with dayNumber out of range', () => {
    expect(() => MissionSchema.parse({ ...validMission, dayNumber: 0 })).toThrow();
    expect(() => MissionSchema.parse({ ...validMission, dayNumber: 8 })).toThrow();
  });

  it('rejects mission with negative durationMinutes', () => {
    expect(() => MissionSchema.parse({ ...validMission, durationMinutes: -1 })).toThrow();
    expect(() => MissionSchema.parse({ ...validMission, durationMinutes: 0 })).toThrow();
  });

  it('rejects mission with invalid difficulty', () => {
    expect(() => MissionSchema.parse({ ...validMission, difficulty: 'hard' })).toThrow();
  });

  it('rejects mission with missing required fields', () => {
    const { story, ...noStory } = validMission;
    expect(() => MissionSchema.parse(noStory)).toThrow();
  });

  it('rejects mission with empty youtubeVideoId', () => {
    expect(() => MissionSchema.parse({ ...validMission, youtubeVideoId: '' })).toThrow();
  });

  it('rejects mission with non-positive rewardStars', () => {
    expect(() => MissionSchema.parse({ ...validMission, rewardStars: 0 })).toThrow();
    expect(() => MissionSchema.parse({ ...validMission, rewardStars: -1 })).toThrow();
  });
});

describe('ItemSchema', () => {
  it('validates a correct room decoration item', () => {
    const result = ItemSchema.parse(validItem);
    expect(result).toEqual(validItem);
  });

  it('validates a correct accessory item', () => {
    const result = ItemSchema.parse(validAccessoryItem);
    expect(result).toEqual(validAccessoryItem);
  });

  it('accepts item without optional fields', () => {
    const minimalItem = {
      id: 'basic-item',
      name: 'Basic',
      type: 'room-decoration',
      imageSrc: '/assets/items/basic.svg',
      unlockSource: 'stars',
      requiredStars: 10,
    };
    expect(() => ItemSchema.parse(minimalItem)).not.toThrow();
  });

  it('rejects item with invalid type', () => {
    expect(() => ItemSchema.parse({ ...validItem, type: 'weapon' })).toThrow();
  });

  it('rejects item with invalid roomSlotId', () => {
    expect(() => ItemSchema.parse({ ...validItem, roomSlotId: 'ceiling' })).toThrow();
  });

  it('rejects item with missing id', () => {
    const { id, ...noId } = validItem;
    expect(() => ItemSchema.parse(noId)).toThrow();
  });

  it('rejects item with empty name', () => {
    expect(() => ItemSchema.parse({ ...validItem, name: '' })).toThrow();
  });
});

describe('WorkoutCompletionSchema', () => {
  it('validates a correct completion', () => {
    const completion = { missionId: 'mission-day-01', completedAt: '2024-01-15T10:00:00Z', videoEnded: true };
    expect(WorkoutCompletionSchema.parse(completion)).toEqual(completion);
  });

  it('rejects completion with empty missionId', () => {
    expect(() => WorkoutCompletionSchema.parse({ missionId: '', completedAt: '2024-01-15', videoEnded: true })).toThrow();
  });

  it('rejects completion with missing videoEnded', () => {
    expect(() => WorkoutCompletionSchema.parse({ missionId: 'mission-day-01', completedAt: '2024-01-15' })).toThrow();
  });
});

describe('ChildProgressStateSchema', () => {
  it('validates a complete valid progress state', () => {
    const result = ChildProgressStateSchema.parse(validProgressState);
    expect(result.version).toBe(1);
    expect(result.selectedCharacterId).toBe('bear-honey');
    expect(result.totalStars).toBe(6);
    expect(result.completedMissions).toHaveLength(2);
  });

  it('validates minimal progress state (fresh start)', () => {
    const minimal = {
      version: 1,
      totalStars: 0,
      completedMissions: [],
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
    };
    expect(() => ChildProgressStateSchema.parse(minimal)).not.toThrow();
  });

  it('validates state without optional nickname', () => {
    const { childNickname, ...noNickname } = validProgressState;
    expect(() => ChildProgressStateSchema.parse(noNickname)).not.toThrow();
  });

  it('rejects state with missing version', () => {
    const { version, ...noVersion } = validProgressState;
    expect(() => ChildProgressStateSchema.parse(noVersion)).toThrow();
  });

  it('rejects state with version 0', () => {
    expect(() => ChildProgressStateSchema.parse({ ...validProgressState, version: 0 })).toThrow();
  });

  it('rejects state with negative totalStars', () => {
    expect(() => ChildProgressStateSchema.parse({ ...validProgressState, totalStars: -1 })).toThrow();
  });

  it('rejects state with invalid selectedCharacterId', () => {
    expect(() => ChildProgressStateSchema.parse({ ...validProgressState, selectedCharacterId: 'dog-fire' })).toThrow();
  });

  it('rejects state with non-array completedMissions', () => {
    expect(() => ChildProgressStateSchema.parse({ ...validProgressState, completedMissions: 'not-array' })).toThrow();
  });

  it('rejects state with invalid completion entry', () => {
    const badState = {
      ...validProgressState,
      completedMissions: [{ missionId: '', completedAt: '', videoEnded: true }],
    };
    expect(() => ChildProgressStateSchema.parse(badState)).toThrow();
  });
});

describe('isConfiguredVideoId', () => {
  it('returns true for valid 11-character YouTube IDs', () => {
    expect(isConfiguredVideoId('dQw4w9WgXcQ')).toBe(true);
    expect(isConfiguredVideoId('abc123_-XYZ')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isConfiguredVideoId('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isConfiguredVideoId('   ')).toBe(false);
  });

  it('returns false for placeholder IDs', () => {
    expect(isConfiguredVideoId('VIDEO_ID_TO_BE_SUPPLIED_01')).toBe(false);
    expect(isConfiguredVideoId('VIDEO_ID_TO_BE_SUPPLIED_07')).toBe(false);
  });

  it('returns false for IDs with wrong length', () => {
    expect(isConfiguredVideoId('short')).toBe(false);
    expect(isConfiguredVideoId('thisIsTooLongToBeAVideoId')).toBe(false);
  });

  it('returns false for IDs with invalid characters', () => {
    expect(isConfiguredVideoId('abc!@#$%^&*')).toBe(false);
    expect(isConfiguredVideoId('has spaces!')).toBe(false);
  });
});
