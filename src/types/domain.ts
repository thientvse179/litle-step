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
  dayNumber: number;
  title: string;
  kidTitle: string;
  story: string;
  youtubeVideoId: string;
  durationMinutes: number;
  difficulty: Difficulty;
  rewardStars: number;
  rewardItemId: string;
  parentSafetyNote: string;
  isActive: boolean;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  imageSrc: string;
  roomSlotId?: RoomSlotId;
  compatibleCharacterIds?: CharacterId[];
  unlockSource: 'mission' | 'stars';
  unlockMissionId?: string;
  requiredStars?: number;
}

export interface WorkoutCompletion {
  missionId: string;
  completedAt: string;
  videoEnded: boolean;
}

export interface ChildProgressState {
  version: number;
  childNickname?: string;
  selectedCharacterId?: CharacterId;
  totalStars: number;
  completedMissions: WorkoutCompletion[];
  unlockedItemIds: string[];
  equippedAccessoryItemIds: string[];
  roomLayout: Partial<Record<RoomSlotId, string>>;
}

export type CompletionResult =
  | { status: 'awarded'; starsAdded: number; unlockedItemId: string }
  | { status: 'already-completed'; starsAdded: 0; unlockedItemId?: string }
  | { status: 'invalid'; reason: string };

export type EquipResult =
  | { status: 'equipped' }
  | { status: 'invalid'; reason: string };
