'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  className,
}: SecondaryButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={cn(
        'w-full min-h-[56px] md:min-h-[64px] px-6 py-3.5 rounded-[var(--radius-button)]',
        'bg-bg-card text-text-primary font-display font-semibold text-lg md:text-xl',
        'border-2 border-accent-soft',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors',
        className
      )}
    >
      {children}
    </motion.button>
  );
}
