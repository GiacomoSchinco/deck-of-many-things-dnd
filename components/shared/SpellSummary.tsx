// components/shared/SpellSummary.tsx
import { Clock, Hourglass, Target } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { Spell } from '@/types/spell';

type SpellFlags = Pick<Spell, 'ritual' | 'concentration'>;
type SpellTiming = Pick<Spell, 'casting_time' | 'range' | 'duration'>;

interface SpellFlagBadgesProps {
  spell: SpellFlags;
  /**
   * `sheet` = badge colorati con etichetta estesa (scheda personaggio).
   * `compact` = badge outline con etichette corte (wizard, liste dense).
   */
  variant?: 'sheet' | 'compact';
}

/**
 * Etichette "Rituale" / "Concentrazione".
 *
 * Erano duplicate in quattro liste con due vesti diverse; la veste è
 * l'unica differenza reale, quindi è una prop e non due componenti.
 */
export function SpellFlagBadges({ spell, variant = 'sheet' }: SpellFlagBadgesProps) {
  if (!spell.ritual && !spell.concentration) return null;

  if (variant === 'compact') {
    return (
      <>
        {spell.ritual && (
          <Badge variant="outline" className="text-xs py-0 h-4">
            Rituale
          </Badge>
        )}
        {spell.concentration && (
          <Badge variant="outline" className="text-xs py-0 h-4">
            Conc.
          </Badge>
        )}
      </>
    );
  }

  return (
    <>
      {spell.ritual && (
        <Badge className="text-xs border-school-illusion/35 bg-school-illusion/10 text-school-illusion">
          Rituale
        </Badge>
      )}
      {spell.concentration && (
        <Badge className="text-xs border-antique-gold/40 bg-antique-gold/15 text-frame-deep">
          Concentrazione
        </Badge>
      )}
    </>
  );
}

/** Riga tempo di lancio / gittata / durata sotto il nome dell'incantesimo. */
export function SpellMetaRow({ spell }: { spell: SpellTiming }) {
  if (!spell.casting_time && !spell.range && !spell.duration) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-muted">
      {spell.casting_time && (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {spell.casting_time}
        </span>
      )}
      {spell.range && (
        <span className="flex items-center gap-1">
          <Target className="h-3 w-3" aria-hidden="true" />
          {spell.range}
        </span>
      )}
      {spell.duration && (
        <span className="flex items-center gap-1">
          <Hourglass className="h-3 w-3" aria-hidden="true" />
          {spell.duration}
        </span>
      )}
    </div>
  );
}
