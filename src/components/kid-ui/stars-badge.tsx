import { cn } from '@/lib/utils';

interface StarsBadgeProps {
  count: number;
  className?: string;
}

export function StarsBadge({ count, className }: StarsBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'bg-amber-50 text-amber-700 font-semibold text-sm',
        className
      )}
      aria-label={`${count} sao`}
    >
      <span className="text-star" aria-hidden="true">⭐</span>
      <span>{count}</span>
    </div>
  );
}
