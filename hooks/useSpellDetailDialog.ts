// hooks/useSpellDetailDialog.ts
'use client';

import { useCallback, useState } from 'react';

import type { Spell } from '@/types/spell';

/**
 * Stato del dialog di dettaglio incantesimo.
 *
 * Era ripetuto in quattro posti come `const [detailSpell, setDetailSpell] =
 * useState<Spell | null>(null)` più `<SpellDetailDialog spell={x} open={x !==
 * null} onClose={() => setX(null)} />`. Il contratto `open = spell !== null`
 * è l'unica cosa che va ricordata, quindi la calcola l'hook.
 */
export function useSpellDetailDialog() {
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null);

  const openDetail = useCallback((spell: Spell) => setDetailSpell(spell), []);
  const closeDetail = useCallback(() => setDetailSpell(null), []);

  return {
    detailSpell,
    openDetail,
    closeDetail,
    /** Props pronte da spargere su `<SpellDetailDialog {...dialogProps} />`. */
    dialogProps: {
      spell: detailSpell,
      open: detailSpell !== null,
      onClose: closeDetail,
    },
  };
}
