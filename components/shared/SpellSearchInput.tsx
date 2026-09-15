// components/shared/SpellSearchInput.tsx
'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SpellSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** `sm` per i pannelli secondari (swap, dialog), `md` per le liste principali. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Campo di ricerca incantesimi.
 *
 * Era copiato identico in sei punti (`SpellsStep` ×3, `LevelUpSpellsStep` ×2,
 * `PreparedSpellsManager`): stessa icona, stesso `pl-9`, stessi colori ambra.
 * Qui l'unica variabile è la densità, quindi la densità è l'unica prop.
 */
export function SpellSearchInput({
  value,
  onChange,
  placeholder = 'Cerca incantesimo...',
  size = 'md',
  className,
}: SpellSearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-amber-500',
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
        )}
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn('bg-amber-50 pl-9 border-amber-300', size === 'sm' && 'h-8 text-sm')}
      />
    </div>
  );
}
