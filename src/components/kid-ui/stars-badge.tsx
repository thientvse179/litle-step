import { cn } from '@/lib/utils';

interface StarsBadgeProps {
  count: number;
  className?: string;
}

export function StarsBadge({ count, className }: StarsBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full',
        'bg-amber-50 text-amber-700 font-display font-extrabold text-base',
        'border-2 border-amber-200 shadow-sm',
        className
      )}
      aria-label={`${count} sao`}
    >
      <span className="text-star text-lg" aria-hidden="true">⭐</span>
      <span className="tabular-nums">{count}</span>
    </div>
  );
}
