import { z } from 'zod';

export const CharacterIdSchema = z.enum(['rabbit-cloud', 'bear-honey', 'cat-star']);
export const DifficultySchema = z.enum(['easy', 'medium']);
export const RoomSlotIdSchema = z.enum([
  'floor-rug',
  'bed',
  'window',
  'wall-art',
  'lamp',
  'plant',
  'toy',
]);
export const ItemTypeSchema = z.enum(['room-decoration', 'character-accessory']);

export const CharacterSchema = z.object({
  id: CharacterIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  avatarSrc: z.string().min(1),
  roomBackgroundSrc: z.string().min(1),
});

export const MissionSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(1).max(7),
  title: z.string().min(1),
  kidTitle: z.string().min(1),
  story: z.string().min(1),
  youtubeVideoId: z.string().min(1),
  durationMinutes: z.number().positive(),
  difficulty: DifficultySchema,
  rewardStars: z.number().int().positive(),
  requiredReps: z.number().int().min(1),
  parentSafetyNote: z.string().min(1),
  isActive: z.boolean(),
});

export const ItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: ItemTypeSchema,
  imageSrc: z.string().min(1),
  roomSlotId: RoomSlotIdSchema.optional(),
  compatibleCharacterIds: z.array(CharacterIdSchema).optional(),
  unlockSource: z.enum(['daily-reward', 'stars']),
});

export const DailyProgressSchema = z.object({
  date: z.string().min(1),
  completedMissionIds: z.array(z.string()),
  missionReps: z.record(z.string(), z.number()).optional().default({}),
  dailyRewardClaimed: z.boolean(),
});

export const ChildProgressStateSchema = z.object({
  version: z.number().int().min(1),
  childNickname: z.string().optional(),
  selectedCharacterId: CharacterIdSchema.optional(),
  totalStars: z.number().int().min(0),
  totalDaysCompleted: z.number().int().min(0),
  dailyProgress: DailyProgressSchema,
  unlockedItemIds: z.array(z.string()),
  equippedAccessoryItemIds: z.array(z.string()),
  roomLayout: z.record(z.string(), z.string()).optional().default({}),
});

/**
 * Checks if a YouTube video ID is a real configured ID (not a placeholder).
 */
export function isConfiguredVideoId(videoId: string): boolean {
  if (!videoId || videoId.trim().length === 0) return false;
  if (videoId.startsWith('VIDEO_ID_TO_BE_SUPPLIED')) return false;
  // YouTube video IDs are typically 11 characters
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return false;
  return true;
}
