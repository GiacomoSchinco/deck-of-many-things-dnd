// components/shared/StatRow.tsx
import { cn } from '@/lib/utils';

interface StatRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

/**
 * Riga label/valore usata nelle sezioni info del personaggio.
 * Sostituisce il pattern ripetuto:
 *   <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
 *     <span className="text-amber-800">{label}</span>
 *     <span className="font-bold text-amber-900">{value}</span>
 *   </div>
 */
export function StatRow({ label, value, className }: StatRowProps) {
  return (
    <div className={cn('fantasy-row', className)}>
      <span className="fantasy-label">{label}</span>
      <span className="fantasy-value">{value}</span>
    </div>
  );
}
