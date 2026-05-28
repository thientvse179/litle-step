import { describe, it, expect } from 'vitest';
import { characters } from './characters';
import { missions } from './missions';
import { items } from './items';
import {
  CharacterSchema,
  MissionSchema,
  ItemSchema,
  RoomSlotIdSchema,
  isConfiguredVideoId,
} from '@/lib/validation/schemas';
import type { RoomSlotId } from '@/types/domain';

describe('Seed catalog validation', () => {
  describe('Characters', () => {
    it('should have exactly 3 characters', () => {
      expect(characters).toHaveLength(3);
    });

    it.each(characters)('character "$id" passes CharacterSchema', (character) => {
      const result = CharacterSchema.safeParse(character);
      expect(result.success).toBe(true);
    });
  });

  describe('Missions', () => {
    it('should have exactly 7 missions', () => {
      expect(missions).toHaveLength(7);
    });

    it.each(missions)('mission "$id" passes MissionSchema', (mission) => {
      const result = MissionSchema.safeParse(mission);
      expect(result.success).toBe(true);
    });
  });

  describe('Items', () => {
    it('should have exactly 7 items', () => {
      expect(items).toHaveLength(7);
    });

    it.each(items)('item "$id" passes ItemSchema', (item) => {
      const result = ItemSchema.safeParse(item);
      expect(result.success).toBe(true);
    });
  });

  describe('Referential integrity: mission.rewardItemId → items', () => {
    const itemIds = new Set(items.map((i) => i.id));

    it.each(missions)(
      'mission "$id" rewardItemId "$rewardItemId" exists in items catalog',
      (mission) => {
        expect(itemIds.has(mission.rewardItemId)).toBe(true);
      }
    );
  });

  describe('Referential integrity: item.unlockMissionId → missions', () => {
    const missionIds = new Set(missions.map((m) => m.id));

    const itemsWithMissionUnlock = items.filter(
      (i) => i.unlockSource === 'mission' && i.unlockMissionId
    );

    it.each(itemsWithMissionUnlock)(
      'item "$id" unlockMissionId "$unlockMissionId" exists in missions catalog',
      (item) => {
        expect(missionIds.has(item.unlockMissionId!)).toBe(true);
      }
    );
  });

  describe('Referential integrity: item.roomSlotId → valid RoomSlotId', () => {
    const validSlotIds: RoomSlotId[] = [
      'floor-rug',
      'bed',
      'window',
      'wall-art',
      'lamp',
      'plant',
      'toy',
    ];

    const roomDecorationItems = items.filter(
      (i) => i.type === 'room-decoration' && i.roomSlotId
    );

    it.each(roomDecorationItems)(
      'item "$id" roomSlotId "$roomSlotId" is a valid RoomSlotId',
      (item) => {
        expect(validSlotIds).toContain(item.roomSlotId);
        // Also validate via Zod schema
        const result = RoomSlotIdSchema.safeParse(item.roomSlotId);
        expect(result.success).toBe(true);
      }
    );
  });

  describe('Placeholder video ID detection', () => {
    it('all current mission video IDs are correctly detected as placeholders', () => {
      for (const mission of missions) {
        expect(isConfiguredVideoId(mission.youtubeVideoId)).toBe(false);
      }
    });

    it('isConfiguredVideoId rejects empty string', () => {
      expect(isConfiguredVideoId('')).toBe(false);
    });

    it('isConfiguredVideoId rejects whitespace-only string', () => {
      expect(isConfiguredVideoId('   ')).toBe(false);
    });

    it('isConfiguredVideoId rejects placeholder pattern', () => {
      expect(isConfiguredVideoId('VIDEO_ID_TO_BE_SUPPLIED_01')).toBe(false);
      expect(isConfiguredVideoId('VIDEO_ID_TO_BE_SUPPLIED_99')).toBe(false);
    });

    it('isConfiguredVideoId rejects invalid format (too short)', () => {
      expect(isConfiguredVideoId('abc')).toBe(false);
    });

    it('isConfiguredVideoId rejects invalid format (too long)', () => {
      expect(isConfiguredVideoId('abcdefghijklm')).toBe(false);
    });

    it('isConfiguredVideoId accepts valid 11-char YouTube ID', () => {
      expect(isConfiguredVideoId('dQw4w9WgXcQ')).toBe(true);
      expect(isConfiguredVideoId('abc_def-123')).toBe(true);
    });
  });
});
