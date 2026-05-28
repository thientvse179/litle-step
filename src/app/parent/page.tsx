'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { getCharacterById } from '@/data/characters';
import { getMissionById, getNextMission, missions } from '@/data/missions';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, PrimaryButton, SecondaryButton } from '@/components/kid-ui';

export default function ParentPage() {
  return (
    <HydrationGuard>
      <ParentContent />
    </HydrationGuard>
  );
}

function ParentContent() {
  const router = useRouter();
  const { progress, resetProgress } = useProgressStore();
  const [showReset, setShowReset] = useState(false);

  const character = progress.selectedCharacterId
    ? getCharacterById(progress.selectedCharacterId)
    : null;
  const completedIds = progress.completedMissions.map((c) => c.missionId);
  const nextMission = getNextMission(completedIds);

  const handleReset = () => {
    resetProgress();
    router.replace('/onboarding');
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Khu vực bố mẹ</h1>
        <SecondaryButton
          onClick={() => router.push('/')}
          className="w-auto text-sm px-3 py-2"
        >
          Đóng
        </SecondaryButton>
      </div>

      <p className="text-xs text-text-secondary bg-orange-50 rounded-lg p-2">
        ⚠️ Đây không phải cơ chế bảo mật đăng nhập. Chỉ là bước ngăn bé vô tình thao tác.
      </p>

      {/* Progress summary */}
      <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm space-y-3">
        <h2 className="font-semibold">Tiến độ</h2>

        {character && (
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {character.id === 'rabbit-cloud' && '🐰'}
              {character.id === 'bear-honey' && '🐻'}
              {character.id === 'cat-star' && '🐱'}
            </span>
            <span>{character.name}</span>
            {progress.childNickname && (
              <span className="text-text-secondary text-sm">
                ({progress.childNickname})
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-amber-50 rounded-lg p-2 text-center">
            <p className="font-semibold text-lg">{progress.totalStars}</p>
            <p className="text-text-secondary">Sao</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="font-semibold text-lg">
              {completedIds.length}/{missions.length}
            </p>
            <p className="text-text-secondary">Nhiệm vụ</p>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-medium mb-1">Vật phẩm đã mở khóa:</p>
          <p className="text-text-secondary">
            {progress.unlockedItemIds.length > 0
              ? `${progress.unlockedItemIds.length} vật phẩm`
              : 'Chưa có'}
          </p>
        </div>
      </div>

      {/* Completion history */}
      <div className="bg-bg-card rounded-[var(--radius-card)] p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Lịch sử tập luyện</h2>
        {progress.completedMissions.length === 0 ? (
          <p className="text-sm text-text-secondary">Chưa có buổi tập nào.</p>
        ) : (
          <div className="space-y-2">
            {progress.completedMissions.map((completion) => {
              const m = getMissionById(completion.missionId);
              return (
                <div
                  key={completion.missionId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{m?.kidTitle ?? completion.missionId}</span>
                  <span className="text-text-secondary text-xs">
                    {new Date(completion.completedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next mission safety note */}
      {nextMission && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
          <p className="text-sm font-medium text-orange-700 mb-1">
            Ghi chú an toàn — Buổi tiếp theo
          </p>
          <p className="text-sm text-text-secondary">
            <strong>{nextMission.kidTitle}:</strong> {nextMission.parentSafetyNote}
          </p>
        </div>
      )}

      {/* General safety note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
        <p className="text-sm font-medium text-blue-700 mb-1">
          Lưu ý chung khi tập
        </p>
        <p className="text-sm text-text-secondary">
          Bé nên tập ở nơi rộng, nền không trơn và có người lớn quan sát.
          Dừng lại nếu bé thấy đau hoặc khó chịu.
        </p>
      </div>

      {/* Reset */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="text-sm text-error"
          >
            Xóa toàn bộ tiến độ...
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-medium text-red-700 mb-2">
              Xác nhận xóa tiến độ?
            </p>
            <p className="text-xs text-text-secondary mb-3">
              Tất cả dữ liệu (nhân vật, sao, vật phẩm, trang trí) sẽ bị xóa.
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2">
              <PrimaryButton
                onClick={handleReset}
                className="bg-error"
              >
                Xóa hết
              </PrimaryButton>
              <SecondaryButton onClick={() => setShowReset(false)}>
                Hủy
              </SecondaryButton>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
