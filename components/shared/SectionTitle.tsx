// components/shared/SectionTitle.tsx
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Intestazione di sezione con stile fantasy.
 * Sostituisce il pattern ripetuto:
 *   <h2 className="text-xl font-serif font-bold text-amber-900 mb-4 text-center border-b border-amber-200 pb-2">
 */
export function SectionTitle({ children, size = 'md', className }: SectionTitleProps) {
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <h2 className={cn('fantasy-section-header', sizeClass, className)}>
      {children}
    </h2>
  );
}
