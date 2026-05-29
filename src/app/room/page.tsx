'use client';

import { useState } from 'react';
import { useProgressStore } from '@/stores/progress-store';
import { getItemsForSlot } from '@/data/items';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, KidCard } from '@/components/kid-ui';
import { RoomPreview } from '@/components/room/room-preview';
import { BottomNav } from '@/components/common/bottom-nav';
import type { RoomSlotId } from '@/types/domain';

const SLOTS: { id: RoomSlotId; label: string; emoji: string }[] = [
  { id: 'floor-rug', label: 'Thảm', emoji: '🟫' },
  { id: 'bed', label: 'Giường', emoji: '🛏️' },
  { id: 'window', label: 'Cửa sổ', emoji: '🪟' },
  { id: 'wall-art', label: 'Tranh tường', emoji: '🖼️' },
  { id: 'lamp', label: 'Đèn', emoji: '💡' },
  { id: 'plant', label: 'Cây', emoji: '🌱' },
  { id: 'toy', label: 'Đồ chơi', emoji: '🧸' },
];

export default function RoomPage() {
  return (
    <HydrationGuard>
      <RoomContent />
    </HydrationGuard>
  );
}

function RoomContent() {
  const { progress, equipRoomItem, clearRoomSlot } = useProgressStore();
  const [selectedSlot, setSelectedSlot] = useState<RoomSlotId | null>(null);

  const availableItems = selectedSlot
    ? getItemsForSlot(selectedSlot, progress.unlockedItemIds)
    : [];

  const currentItemInSlot = selectedSlot
    ? progress.roomLayout[selectedSlot]
    : undefined;

  return (
    <>
      <PageShell>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Trang trí phòng</h1>
      </div>

      <RoomPreview />

      {/* Slot selector */}
      <div className="grid grid-cols-4 gap-2">
        {SLOTS.map((slot) => {
          const hasItem = !!progress.roomLayout[slot.id];
          return (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              aria-label={`Vị trí: ${slot.label}`}
              className={`flex flex-col items-center justify-center gap-1 p-2 min-h-[48px] rounded-xl text-xs transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                selectedSlot === slot.id
                  ? 'bg-accent-soft ring-2 ring-accent'
                  : hasItem
                  ? 'bg-green-50'
                  : 'bg-bg-card'
              }`}
            >
              <span className="text-lg" aria-hidden="true">{slot.emoji}</span>
              <span>{slot.label}</span>
            </button>
          );
        })}
      </div>

      {/* Item picker */}
      {selectedSlot && (
        <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
          <p className="text-sm font-medium mb-3">
            Chọn đồ cho vị trí: {SLOTS.find((s) => s.id === selectedSlot)?.label}
          </p>

          {availableItems.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-4">
              Chưa có đồ cho vị trí này. Hãy hoàn thành nhiệm vụ để nhận thêm! 🌟
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {availableItems.map((item) => (
                <KidCard
                  key={item.id}
                  selected={currentItemInSlot === item.id}
                  onClick={() => equipRoomItem({ slotId: selectedSlot, itemId: item.id })}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {getItemEmoji(item.id)}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                    {currentItemInSlot === item.id && (
                      <span className="ml-auto text-xs text-success">✓ Đang dùng</span>
                    )}
                  </div>
                </KidCard>
              ))}

              {currentItemInSlot && (
                <button
                  onClick={() => clearRoomSlot(selectedSlot)}
                  className="text-sm text-text-secondary py-3 min-h-[48px]"
                >
                  Bỏ đồ khỏi vị trí này
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </PageShell>
    <BottomNav />
    </>
  );
}

function getItemEmoji(id: string): string {
  switch (id) {
    case 'rug-rainbow': return '🌈';
    case 'bed-cloud': return '🛏️';
    case 'lamp-star': return '💡';
    case 'window-magic': return '🪟';
    case 'plant-happy': return '🌱';
    case 'toy-treasure-chest': return '📦';
    default: return '✨';
  }
}
