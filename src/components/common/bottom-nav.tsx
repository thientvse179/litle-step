'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  emoji: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Nhà', emoji: '🏠' },
  { href: '/room', label: 'Phòng', emoji: '🛋️' },
  { href: '/wardrobe', label: 'Phụ kiện', emoji: '🎒' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="sticky bottom-0 z-20 mt-auto border-t border-accent-soft bg-bg-card/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => {
                if (!isActive) router.push(item.href);
              }}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[60px] md:min-h-[72px]',
                'font-display text-xs md:text-sm font-bold transition-colors',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
                isActive ? 'text-accent' : 'text-text-secondary'
              )}
            >
              <span
                className={cn(
                  'text-3xl md:text-4xl transition-transform',
                  isActive && 'scale-110'
                )}
                aria-hidden="true"
              >
                {item.emoji}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
