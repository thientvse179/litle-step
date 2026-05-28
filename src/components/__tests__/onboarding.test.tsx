import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingPage from '@/app/onboarding/page';
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

// Mock motion to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

function resetStore() {
  useProgressStore.setState({
    hydrated: true,
    progress: {
      version: 1,
      totalStars: 0,
      completedMissions: [],
      unlockedItemIds: [],
      equippedAccessoryItemIds: [],
      roomLayout: {},
    },
  });
}

describe('Onboarding Page', () => {
  beforeEach(() => {
    resetStore();
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('shows welcome screen initially', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Nhà Nhỏ Vận Động')).toBeInTheDocument();
    expect(screen.getByText('Bắt đầu')).toBeInTheDocument();
  });

  it('navigates to character selection after clicking Bắt đầu', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    expect(screen.getByText('Chọn bạn đồng hành')).toBeInTheDocument();
  });

  it('shows all 3 characters', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    expect(screen.getByText('Thỏ Mây')).toBeInTheDocument();
    expect(screen.getByText('Gấu Mật')).toBeInTheDocument();
    expect(screen.getByText('Mèo Sao')).toBeInTheDocument();
  });

  it('disables confirm button until a character is selected', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    const confirmBtn = screen.getByText('Chọn bạn này');
    expect(confirmBtn).toBeDisabled();
  });

  it('enables confirm button after selecting a character', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    fireEvent.click(screen.getByText('Thỏ Mây'));
    const confirmBtn = screen.getByText('Chọn bạn này');
    expect(confirmBtn).not.toBeDisabled();
  });

  it('shows nickname step after confirming character', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    fireEvent.click(screen.getByText('Thỏ Mây'));
    fireEvent.click(screen.getByText('Chọn bạn này'));
    expect(screen.getByText('Tên con là gì?')).toBeInTheDocument();
  });

  it('allows skipping nickname', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    fireEvent.click(screen.getByText('Gấu Mật'));
    fireEvent.click(screen.getByText('Chọn bạn này'));
    fireEvent.click(screen.getByText('Bỏ qua và vào nhà'));

    const { progress } = useProgressStore.getState();
    expect(progress.selectedCharacterId).toBe('bear-honey');
    expect(progress.childNickname).toBeUndefined();
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('saves nickname when provided', () => {
    render(<OnboardingPage />);
    fireEvent.click(screen.getByText('Bắt đầu'));
    fireEvent.click(screen.getByText('Mèo Sao'));
    fireEvent.click(screen.getByText('Chọn bạn này'));

    const input = screen.getByPlaceholderText('Nhập tên con...');
    fireEvent.change(input, { target: { value: 'Bé Na' } });
    fireEvent.click(screen.getByText('Vào nhà thôi!'));

    const { progress } = useProgressStore.getState();
    expect(progress.selectedCharacterId).toBe('cat-star');
    expect(progress.childNickname).toBe('Bé Na');
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('redirects to home if already onboarded', () => {
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

    render(<OnboardingPage />);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
