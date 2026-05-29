export type CharacterId = 'rabbit-cloud' | 'bear-honey' | 'cat-star';
export type Difficulty = 'easy' | 'medium';
export type RoomSlotId =
  | 'floor-rug'
  | 'bed'
  | 'window'
  | 'wall-art'
  | 'lamp'
  | 'plant'
  | 'toy';
export type ItemType = 'room-decoration' | 'character-accessory';

export interface Character {
  id: CharacterId;
  name: string;
  description: string;
  avatarSrc: string;
  roomBackgroundSrc: string;
}

export interface Mission {
  id: string;
  order: number;
  title: string;
  kidTitle: string;
  story: string;
  youtubeVideoId: string;
  durationMinutes: number;
  difficulty: Difficulty;
  rewardStars: number;
  requiredReps: number;
  parentSafetyNote: string;
  isActive: boolean;
}

/** Daily reward item — one per day, cycles through the list */
export interface DailyReward {
  dayIndex: number;
  itemId: string;
  bonusStars: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  imageSrc: string;
  roomSlotId?: RoomSlotId;
  compatibleCharacterIds?: CharacterId[];
  unlockSource: 'mission' | 'daily-reward' | 'stars';
}

/** Tracks which missions were completed today */
export interface DailyProgress {
  date: string; // YYYY-MM-DD
  completedMissionIds: string[];
  missionReps: Record<string, number>; // missionId → reps done today
  dailyRewardClaimed: boolean;
}

export interface ChildProgressState {
  version: number;
  childNickname?: string;
  selectedCharacterId?: CharacterId;
  totalStars: number;
  totalDaysCompleted: number;
  dailyProgress: DailyProgress;
  unlockedItemIds: string[];
  equippedAccessoryItemIds: string[];
  roomLayout: Partial<Record<RoomSlotId, string>>;
}

export type DailyCompletionResult =
  | { status: 'rep-completed'; repsNow: number; repsRequired: number; starsAdded: number }
  | { status: 'mission-completed'; starsAdded: number }
  | { status: 'already-done' }
  | { status: 'invalid'; reason: string };

export type DailyRewardResult =
  | { status: 'awarded'; starsAdded: number; unlockedItemId: string }
  | { status: 'not-ready'; reason: string }
  | { status: 'already-claimed' };

export type EquipResult =
  | { status: 'equipped' }
  | { status: 'invalid'; reason: string };
