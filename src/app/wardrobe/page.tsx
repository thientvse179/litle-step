'use client';

import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getUnlockedAccessories } from '@/data/items';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, SecondaryButton, KidCard } from '@/components/kid-ui';

export default function WardrobePage() {
  return (
    <HydrationGuard>
      <WardrobeContent />
    </HydrationGuard>
  );
}

function WardrobeContent() {
  const router = useRouter();
  const { progress, equipAccessory, removeAccessory } = useProgressStore();

  const accessories = getUnlockedAccessories(progress.unlockedItemIds);

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Phụ kiện</h1>
        <SecondaryButton
          onClick={() => router.push('/')}
          className="w-auto text-sm px-3 py-2 min-h-[44px]"
        >
          Về nhà
        </SecondaryButton>
      </div>

      {/* Character preview */}
      <div className="text-center py-6">
        <div className="relative inline-block">
          <span className="text-6xl">
            {progress.selectedCharacterId === 'rabbit-cloud' && '🐰'}
            {progress.selectedCharacterId === 'bear-honey' && '🐻'}
            {progress.selectedCharacterId === 'cat-star' && '🐱'}
          </span>
          {progress.equippedAccessoryItemIds.length > 0 && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
              🎩
            </span>
          )}
        </div>
      </div>

      {/* Accessories list */}
      {accessories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🎒</p>
          <p className="text-text-secondary text-sm">
            Chưa có phụ kiện nào. Hoàn thành nhiệm vụ để nhận phụ kiện mới!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {accessories.map((item) => {
            const isEquipped = progress.equippedAccessoryItemIds.includes(item.id);
            return (
              <KidCard
                key={item.id}
                selected={isEquipped}
                onClick={() => {
                  if (isEquipped) {
                    removeAccessory(item.id);
                  } else {
                    equipAccessory(item.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎩</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-text-secondary">
                      {isEquipped ? 'Đang đeo' : 'Bấm để đeo'}
                    </p>
                  </div>
                  {isEquipped && (
                    <span className="text-success text-sm">✓</span>
                  )}
                </div>
              </KidCard>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
