import { cn } from '@/lib/utils';

interface ParentNoteProps {
  children: React.ReactNode;
  className?: string;
}

export function ParentNote({ children, className }: ParentNoteProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-orange-50 border border-orange-200 p-3',
        'text-sm text-text-secondary',
        className
      )}
    >
      <p className="font-medium text-orange-700 mb-1">📋 Ghi chú cho bố mẹ</p>
      <p>{children}</p>
    </div>
  );
}
