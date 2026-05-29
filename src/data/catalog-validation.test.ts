import { describe, it, expect } from 'vitest';
import { characters } from './characters';
import { missions } from './missions';
import { items, dailyRewards } from './items';
import {
  CharacterSchema,
  MissionSchema,
  ItemSchema,
  isConfiguredVideoId,
} from '@/lib/validation/schemas';

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

    it('missions have unique order values', () => {
      const orders = missions.map((m) => m.order);
      expect(new Set(orders).size).toBe(orders.length);
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

  describe('Daily rewards', () => {
    it('should have exactly 7 daily rewards', () => {
      expect(dailyRewards).toHaveLength(7);
    });

    it('all daily reward itemIds exist in items catalog', () => {
      const itemIds = new Set(items.map((i) => i.id));
      for (const reward of dailyRewards) {
        expect(itemIds.has(reward.itemId)).toBe(true);
      }
    });

    it('all daily rewards have positive bonus stars', () => {
      for (const reward of dailyRewards) {
        expect(reward.bonusStars).toBeGreaterThan(0);
      }
    });
  });

  describe('Placeholder video ID detection', () => {
    it('isConfiguredVideoId rejects placeholder pattern', () => {
      expect(isConfiguredVideoId('VIDEO_ID_TO_BE_SUPPLIED_01')).toBe(false);
    });

    it('isConfiguredVideoId accepts valid 11-char YouTube ID', () => {
      expect(isConfiguredVideoId('Fs9Etga5-rk')).toBe(true);
    });

    it('isConfiguredVideoId rejects empty string', () => {
      expect(isConfiguredVideoId('')).toBe(false);
    });
  });
});
