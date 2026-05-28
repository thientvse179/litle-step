'use client';

import { useProgressStore } from '@/stores/progress-store';
import { getCharacterById } from '@/data/characters';
import { getItemById } from '@/data/items';
import type { RoomSlotId } from '@/types/domain';
import { cn } from '@/lib/utils';

const SLOT_POSITIONS: Record<RoomSlotId, string> = {
  'floor-rug': 'bottom-4 left-1/2 -translate-x-1/2 w-24 h-12',
  'bed': 'bottom-8 left-4 w-20 h-16',
  'window': 'top-4 left-1/2 -translate-x-1/2 w-16 h-12',
  'wall-art': 'top-8 right-4 w-12 h-12',
  'lamp': 'top-12 left-4 w-10 h-14',
  'plant': 'bottom-4 right-4 w-12 h-16',
  'toy': 'bottom-4 right-16 w-12 h-12',
};

interface RoomPreviewProps {
  compact?: boolean;
}

export function RoomPreview({ compact = false }: RoomPreviewProps) {
  const progress = useProgressStore((s) => s.progress);
  const character = getCharacterById(progress.selectedCharacterId!);

  if (!character) return null;

  return (
    <div
      className={cn(
        'relative rounded-[var(--radius-card)] overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50',
        compact ? 'h-48' : 'h-64'
      )}
      role="img"
      aria-label={`Phòng của ${character.name}`}
    >
      {/* Room background */}
      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
        🏠
      </div>

      {/* Placed items */}
      {Object.entries(progress.roomLayout).map(([slotId, itemId]) => {
        if (!itemId) return null;
        const item = getItemById(itemId);
        if (!item) return null;
        const position = SLOT_POSITIONS[slotId as RoomSlotId];
        return (
          <div
            key={slotId}
            className={cn('absolute', position)}
            aria-label={item.name}
          >
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {getItemEmoji(item.id)}
            </div>
          </div>
        );
      })}

      {/* Character */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-4xl">
        {getCharacterEmoji(character.id)}
        {/* Equipped accessories */}
        {progress.equippedAccessoryItemIds.length > 0 && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg">
            🎩
          </span>
        )}
      </div>
    </div>
  );
}

function getCharacterEmoji(id: string): string {
  switch (id) {
    case 'rabbit-cloud': return '🐰';
    case 'bear-honey': return '🐻';
    case 'cat-star': return '🐱';
    default: return '🐾';
  }
}

function getItemEmoji(id: string): string {
  switch (id) {
    case 'rug-rainbow': return '🌈';
    case 'bed-cloud': return '🛏️';
    case 'lamp-star': return '⭐';
    case 'window-magic': return '🪟';
    case 'plant-happy': return '🌱';
    case 'toy-treasure-chest': return '📦';
    case 'hat-adventure': return '🎩';
    default: return '✨';
  }
}
