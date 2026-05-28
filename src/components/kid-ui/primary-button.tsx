'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className,
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={cn(
        'w-full min-h-[48px] px-6 py-3 rounded-[var(--radius-button)]',
        'bg-accent text-white font-semibold text-lg',
        'shadow-md active:shadow-sm',
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
