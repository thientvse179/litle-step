import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ParentPage from '@/app/parent/page';
import { useProgressStore } from '@/stores/progress-store';

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
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

function setProgress(overrides: Partial<ReturnType<typeof useProgressStore.getState>['progress']> = {}) {
  useProgressStore.setState({
    hydrated: true,
    progress: {
      version: 1,
      selectedCharacterId: 'bear-honey',
      childNickname: 'Bé Gấu',
      totalStars: 6,
      completedMissions: [
        { missionId: 'mission-day-01', completedAt: '2024-01-01T00:00:00Z', videoEnded: true },
        { missionId: 'mission-day-02', completedAt: '2024-01-02T00:00:00Z', videoEnded: true },
        { missionId: 'mission-day-03', completedAt: '2024-01-03T00:00:00Z', videoEnded: true },
      ],
      unlockedItemIds: ['rug-rainbow', 'bed-cloud', 'lamp-star'],
      equippedAccessoryItemIds: [],
      roomLayout: { 'floor-rug': 'rug-rainbow' },
      ...overrides,
    },
  });
}

describe('Parent Page', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('shows parent area title', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText('Khu vực bố mẹ')).toBeInTheDocument();
  });

  it('shows security disclaimer', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText(/không phải cơ chế bảo mật/)).toBeInTheDocument();
  });

  it('shows character name and nickname', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText('Gấu Mật')).toBeInTheDocument();
    expect(screen.getByText('(Bé Gấu)')).toBeInTheDocument();
  });

  it('shows correct star count', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('shows correct mission count', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText('3/7')).toBeInTheDocument();
  });

  it('shows completion history', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText('Bước Chân Đầu Tiên')).toBeInTheDocument();
    expect(screen.getByText('Vượt Suối Lấp Lánh')).toBeInTheDocument();
    expect(screen.getByText('Leo Đồi Tìm Sao')).toBeInTheDocument();
  });

  it('shows next mission safety note', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText(/Giữ Cầu Thật Vững/)).toBeInTheDocument();
    expect(screen.getByText(/giữ thăng bằng/)).toBeInTheDocument();
  });

  it('shows general safety note', () => {
    setProgress();
    render(<ParentPage />);
    expect(screen.getByText(/nền không trơn/)).toBeInTheDocument();
  });

  describe('Reset flow', () => {
    it('shows reset button initially', () => {
      setProgress();
      render(<ParentPage />);
      expect(screen.getByText('Xóa toàn bộ tiến độ...')).toBeInTheDocument();
    });

    it('shows confirmation after clicking reset', () => {
      setProgress();
      render(<ParentPage />);
      fireEvent.click(screen.getByText('Xóa toàn bộ tiến độ...'));
      expect(screen.getByText('Xác nhận xóa tiến độ?')).toBeInTheDocument();
      expect(screen.getByText('Xóa hết')).toBeInTheDocument();
      expect(screen.getByText('Hủy')).toBeInTheDocument();
    });

    it('cancels reset when clicking Hủy', () => {
      setProgress();
      render(<ParentPage />);
      fireEvent.click(screen.getByText('Xóa toàn bộ tiến độ...'));
      fireEvent.click(screen.getByText('Hủy'));
      // Should go back to showing the initial reset button
      expect(screen.getByText('Xóa toàn bộ tiến độ...')).toBeInTheDocument();
    });

    it('resets progress and redirects to onboarding', () => {
      setProgress();
      render(<ParentPage />);
      fireEvent.click(screen.getByText('Xóa toàn bộ tiến độ...'));
      fireEvent.click(screen.getByText('Xóa hết'));

      const { progress } = useProgressStore.getState();
      expect(progress.selectedCharacterId).toBeUndefined();
      expect(progress.totalStars).toBe(0);
      expect(progress.completedMissions).toEqual([]);
      expect(mockReplace).toHaveBeenCalledWith('/onboarding');
    });
  });
});
