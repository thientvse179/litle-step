'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/stores/progress-store';
import { characters } from '@/data/characters';
import { HydrationGuard } from '@/components/common/hydration-guard';
import { PageShell, PrimaryButton, KidCard } from '@/components/kid-ui';
import type { CharacterId } from '@/types/domain';

export default function OnboardingPage() {
  return (
    <HydrationGuard>
      <OnboardingContent />
    </HydrationGuard>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const { selectCharacter, setNickname, progress } = useProgressStore();
  const [step, setStep] = useState<'welcome' | 'character' | 'nickname'>(
    'welcome'
  );
  const [selectedId, setSelectedId] = useState<CharacterId | null>(null);
  const [nickname, setNicknameValue] = useState('');

  // If already onboarded, redirect
  if (progress.selectedCharacterId) {
    router.replace('/');
    return null;
  }

  if (step === 'welcome') {
    return (
      <PageShell className="items-center justify-center text-center">
        <p className="text-5xl mb-4">🏠</p>
        <h1 className="text-2xl font-bold mb-2">Nhà Nhỏ Vận Động</h1>
        <p className="text-text-secondary mb-8">
          Cùng bạn thú tập vận động và xây ngôi nhà đáng yêu nhé!
        </p>
        <PrimaryButton onClick={() => setStep('character')}>
          Bắt đầu
        </PrimaryButton>
      </PageShell>
    );
  }

  if (step === 'character') {
    return (
      <PageShell>
        <h1 className="text-xl font-bold text-center mb-2">
          Chọn bạn đồng hành
        </h1>
        <p className="text-sm text-text-secondary text-center mb-4">
          Con muốn cùng ai xây nhà?
        </p>

        <div className="flex flex-col gap-3">
          {characters.map((char) => (
            <KidCard
              key={char.id}
              selected={selectedId === char.id}
              onClick={() => setSelectedId(char.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {char.id === 'rabbit-cloud' && '🐰'}
                  {char.id === 'bear-honey' && '🐻'}
                  {char.id === 'cat-star' && '🐱'}
                </span>
                <div>
                  <p className="font-semibold">{char.name}</p>
                  <p className="text-sm text-text-secondary">
                    {char.description}
                  </p>
                </div>
              </div>
            </KidCard>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <PrimaryButton
            disabled={!selectedId}
            onClick={() => setStep('nickname')}
          >
            Chọn bạn này
          </PrimaryButton>
        </div>
      </PageShell>
    );
  }

  // Nickname step
  return (
    <PageShell className="justify-center">
      <div className="text-center mb-6">
        <p className="text-4xl mb-2">
          {selectedId === 'rabbit-cloud' && '🐰'}
          {selectedId === 'bear-honey' && '🐻'}
          {selectedId === 'cat-star' && '🐱'}
        </p>
        <h1 className="text-xl font-bold">Tên con là gì?</h1>
        <p className="text-sm text-text-secondary mt-1">
          Không bắt buộc — con có thể bỏ qua
        </p>
      </div>

      <input
        type="text"
        value={nickname}
        onChange={(e) => setNicknameValue(e.target.value)}
        placeholder="Nhập tên con..."
        maxLength={20}
        aria-label="Tên của con"
        className="w-full px-4 py-3 rounded-xl border-2 border-accent-soft bg-bg-card text-center text-lg focus:outline-none focus:border-accent"
      />

      <div className="flex flex-col gap-3 mt-6">
        <PrimaryButton
          onClick={() => {
            if (selectedId) {
              selectCharacter(selectedId);
              if (nickname.trim()) {
                setNickname(nickname.trim());
              }
              router.replace('/');
            }
          }}
        >
          {nickname.trim() ? 'Vào nhà thôi!' : 'Bỏ qua và vào nhà'}
        </PrimaryButton>
      </div>
    </PageShell>
  );
}
