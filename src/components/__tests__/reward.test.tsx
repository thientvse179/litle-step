import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RewardPage from '@/app/reward/[missionId]/page';
import { useProgressStore } from '@/stores/progress-store';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ missionId: 'mission-day-01' }),
}));

// Mock motion
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
}));

function resetStore() {
  useProgressStore.setState({
    hydrated: true,
    progress: {
      version: 1,
      selectedCharacterId: 'rabbit-cloud',
      totalStars: 0,
      completedMissions: [],
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
    },
  });
}

describe('Reward Page', () => {
  beforeEach(() => {
    resetStore();
    mockPush.mockClear();
  });

  it('shows locked state when mission not completed', () => {
    render(<RewardPage />);
    expect(screen.getByText('Chưa hoàn thành nhiệm vụ này')).toBeInTheDocument();
    expect(screen.getByText('Đi tập')).toBeInTheDocument();
  });

  it('shows celebration when mission is completed', () => {
    useProgressStore.setState({
      hydrated: true,
      progress: {
        version: 1,
        selectedCharacterId: 'rabbit-cloud',
        totalStars: 2,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow'],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      },
    });

    render(<RewardPage />);
    expect(screen.getByText('Giỏi lắm!')).toBeInTheDocument();
  });

  it('shows reward item name', () => {
    useProgressStore.setState({
      hydrated: true,
      progress: {
        version: 1,
        selectedCharacterId: 'rabbit-cloud',
        totalStars: 2,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow'],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      },
    });

    render(<RewardPage />);
    expect(screen.getByText('Thảm cầu vồng')).toBeInTheDocument();
  });

  it('shows Trang trí ngay and Về nhà buttons', () => {
    useProgressStore.setState({
      hydrated: true,
      progress: {
        version: 1,
        selectedCharacterId: 'rabbit-cloud',
        totalStars: 2,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow'],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      },
    });

    render(<RewardPage />);
    expect(screen.getByText('Trang trí ngay')).toBeInTheDocument();
    expect(screen.getByText('Về nhà')).toBeInTheDocument();
  });

  it('shows stars badge with reward amount', () => {
    useProgressStore.setState({
      hydrated: true,
      progress: {
        version: 1,
        selectedCharacterId: 'rabbit-cloud',
        totalStars: 2,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow'],
        equippedAccessoryItemIds: [],
        roomLayout: {},
      },
    });

    render(<RewardPage />);
    // The StarsBadge shows the mission's rewardStars (2)
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
