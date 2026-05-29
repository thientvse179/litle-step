import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-5', className)}>
      {children}
    </div>
  );
}
