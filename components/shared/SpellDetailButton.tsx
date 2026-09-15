// components/shared/SpellDetailButton.tsx
'use client';

import { Info } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpellDetailButtonProps {
  spellName: string;
  onOpen: () => void;
  className?: string;
}

/**
 * Comando "dettagli" di un incantesimo.
 *
 * Deve stare FUORI dall'area selezionabile della riga: annidare un comando
 * dentro `SelectableCard` produce HTML non valido e un click ambiguo (bug già
 * corretto una volta, vedi `SpellsStep`). Per questo è un componente a sé e
 * non un pezzo della riga.
 */
export function SpellDetailButton({ spellName, onOpen, className }: SpellDetailButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Dettagli di ${spellName}`}
      className={cn(
        'surface-flat grid w-9 shrink-0 place-items-center text-frame transition-colors hover:text-frame-deep',
        className,
      )}
    >
      <Info className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
