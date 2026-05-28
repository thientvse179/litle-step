import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeDashboard } from '@/components/home/home-dashboard';
import { useProgressStore } from '@/stores/progress-store';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock motion
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

function setProgress(overrides: Partial<ReturnType<typeof useProgressStore.getState>['progress']>) {
  useProgressStore.setState({
    hydrated: true,
    progress: {
      version: 1,
      totalStars: 0,
      completedMissions: [],
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
      selectedCharacterId: 'rabbit-cloud',
      ...overrides,
    },
  });
}

describe('HomeDashboard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('New user (just onboarded)', () => {
    beforeEach(() => {
      setProgress({ selectedCharacterId: 'rabbit-cloud' });
    });

    it('shows character name', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Nhà của Thỏ Mây')).toBeInTheDocument();
    });

    it('shows 0 stars', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('shows 0/7 missions completed', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Đã hoàn thành 0/7 nhiệm vụ')).toBeInTheDocument();
    });

    it('shows next mission (day 1)', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Bước Chân Đầu Tiên')).toBeInTheDocument();
    });

    it('shows reward preview for next mission', () => {
      render(<HomeDashboard />);
      expect(screen.getByText(/Thảm cầu vồng/)).toBeInTheDocument();
    });

    it('shows Tập hôm nay button', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Tập hôm nay')).toBeInTheDocument();
    });

    it('shows decoration and wardrobe buttons', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Trang trí phòng')).toBeInTheDocument();
      expect(screen.getByText('Phụ kiện')).toBeInTheDocument();
    });
  });

  describe('Partially completed (3/7 missions)', () => {
    beforeEach(() => {
      setProgress({
        selectedCharacterId: 'bear-honey',
        totalStars: 6,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-03', completedAt: '2024-01-03T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow', 'bed-cloud', 'lamp-star'],
      });
    });

    it('shows correct star count', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('shows 3/7 missions completed', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Đã hoàn thành 3/7 nhiệm vụ')).toBeInTheDocument();
    });

    it('shows next mission (day 4)', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Giữ Cầu Thật Vững')).toBeInTheDocument();
    });

    it('shows nickname when set', () => {
      setProgress({
        selectedCharacterId: 'bear-honey',
        childNickname: 'Bé Gấu',
        totalStars: 6,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-03', completedAt: '2024-01-03T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow', 'bed-cloud', 'lamp-star'],
      });
      render(<HomeDashboard />);
      expect(screen.getByText('Xin chào, Bé Gấu!')).toBeInTheDocument();
    });
  });

  describe('All missions completed (7/7)', () => {
    beforeEach(() => {
      setProgress({
        selectedCharacterId: 'cat-star',
        totalStars: 18,
        completedMissions: [
          { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-03', completedAt: '2024-01-03T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-04', completedAt: '2024-01-04T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-05', completedAt: '2024-01-05T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-06', completedAt: '2024-01-06T00:00:00Z', videoEnded: true },
          { missionId: 'mission-day-07', completedAt: '2024-01-07T00:00:00Z', videoEnded: true },
        ],
        unlockedItemIds: ['rug-rainbow', 'bed-cloud', 'lamp-star', 'window-magic', 'plant-happy', 'hat-adventure', 'toy-treasure-chest'],
      });
    });

    it('shows 7/7 missions completed', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Đã hoàn thành 7/7 nhiệm vụ')).toBeInTheDocument();
    });

    it('shows celebration message', () => {
      render(<HomeDashboard />);
      expect(screen.getByText('Tuyệt vời!')).toBeInTheDocument();
    });

    it('does not show Tập hôm nay button', () => {
      render(<HomeDashboard />);
      expect(screen.queryByText('Tập hôm nay')).not.toBeInTheDocument();
    });
  });
});
