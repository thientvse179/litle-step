'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface KidCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function KidCard({
  children,
  onClick,
  selected = false,
  className,
}: KidCardProps) {
  return (
    <motion.div
      onClick={onClick}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      className={cn(
        'rounded-[var(--radius-card)] bg-bg-card p-4 md:p-5 shadow-sm',
        'transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
        onClick && 'cursor-pointer active:shadow-md',
        selected && 'ring-3 ring-accent shadow-md',
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  );
}
