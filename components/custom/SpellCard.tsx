// components/custom/SpellCard.tsx
'use client';

import React from 'react';
import AncientCardContainer from './AncientCardContainer';
import { cn } from '@/lib/utils';
import {
  Clock,
  Target,
  Hourglass,
  ScrollText,
  Info,
} from 'lucide-react';
import { DndIcon } from '../icons/DndIcon';
import { getSchoolMeta, getSpellLevelMeta } from '@/lib/theme/schools';
import type { Spell } from '@/types/spell';

interface SpellCardProps {
  spell: Spell;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// Icona, colore e nome della scuola arrivano da `lib/theme/schools.ts`:
// prima questo file aveva una propria mappa di colori, diversa da quella di
// tutti gli altri punti dell'app.

export default function SpellCard({ spell, showActions = false, onEdit, onDelete, size = 'md' }: SpellCardProps) {
  const [showDesc, setShowDesc] = React.useState(false);

  const school = getSchoolMeta(spell.school);
  const { icon: LevelIcon, label: levelLabel } = getSpellLevelMeta(spell.level);

  // Formatta i componenti
  const formatComponents = () => {
    const comp = spell.components;
    if (!comp) return '—';
    if (Array.isArray(comp)) {
      const text = comp.join(', ');
      if (comp.includes('M') && spell.material) {
        return <span>{text} <span className="text-xs text-ink-muted">({spell.material})</span></span>;
      }
      return text;
    }
    // se è un oggetto { verbal, somatic, material }
    const parts: string[] = [];
    if (comp.verbal) parts.push('V');
    if (comp.somatic) parts.push('S');
    if (comp.material) parts.push('M');
    return (
      <>
        {parts.length ? parts.join(', ') : '—'}
        {comp.material && <span className="text-xs text-ink-muted block">({comp.material})</span>}
      </>
    );
  };

  return (
    <AncientCardContainer size={size}>
      {/* Description button top-left */}
      {spell.description && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setShowDesc(true)}
              aria-label="Mostra descrizione"
              className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold surface-tile text-frame-deep"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {showDesc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowDesc(false)} />
              <div className="surface-floating p-5 max-w-lg mx-4 z-10">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold text-amber-900">{spell.name}</h3>
                  <button onClick={() => setShowDesc(false)} className="text-xs text-amber-600 hover:underline">Chiudi</button>
                </div>
                <div className="mt-3 text-sm text-amber-700 whitespace-pre-wrap">{spell.description}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Header: nome centrato, livello a dx, rituale/concentrazione badge a dx */}
      <div className="border-b-2 border-amber-700/30 text-center relative">
        <h2 className="text-lg font-bold text-amber-900 font-serif leading-tight">{spell.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
          <span className={cn('text-xs font-medium', school.text)}>{school.it}</span>
          {spell.ritual && (
            <span className="text-xs bg-school-illusion/12 text-school-illusion border border-school-illusion/30 px-2 py-0.5 rounded-full">Rituale</span>
          )}
          {spell.concentration && (
            <span className="text-xs bg-antique-gold/15 text-frame-deep border border-antique-gold/40 px-2 py-0.5 rounded-full">Concentrazione</span>
          )}
        </div>
      </div>

      {/* Icona scuola centrata + livello */}
      <div className="flex flex-col items-center justify-center mt-3 gap-1">
        <DndIcon name={spell.school} className={school.text} size={70} />
        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <LevelIcon className="w-3 h-3" />
          <span>{levelLabel}</span>
        </div>
      </div>

      {/* Statistiche: tempo di lancio, gittata, durata, componenti */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div className="surface-well p-1.5 text-center flex flex-col items-center gap-0.5">
          <Clock className="w-3 h-3 text-frame" />
          <span className="text-amber-800">{spell.casting_time || '—'}</span>
        </div>
        <div className="surface-well p-1.5 text-center flex flex-col items-center gap-0.5">
          <Target className="w-3 h-3 text-frame" />
          <span className="text-amber-800">{spell.range || '—'}</span>
        </div>
        <div className="surface-well p-1.5 text-center flex flex-col items-center gap-0.5">
          <Hourglass className="w-3 h-3 text-frame" />
          <span className="text-amber-800">{spell.duration || '—'}</span>
        </div>
        <div className="surface-well p-1.5 text-center flex flex-col items-center gap-0.5">
          <ScrollText className="w-3 h-3 text-frame" />
          <span className="text-amber-800">{formatComponents()}</span>
        </div>
      </div>

      {/* Azioni opzionali (modifica/elimina) */}
      {showActions && (
        <div className="flex justify-center gap-2 mt-4 pt-2 border-t border-amber-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-xs metal-primary border border-primary/50 text-primary-foreground rounded-control shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press transition-[transform,box-shadow] duration-200"
            >
              Modifica
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-xs metal-danger border border-destructive/50 text-destructive-foreground rounded-control shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press transition-[transform,box-shadow] duration-200"
            >
              Elimina
            </button>
          )}
        </div>
      )}

      {/* Effetto hover decorativo */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-antique-gold/30 rounded-panel transition-colors duration-300" />
    </AncientCardContainer>
  );
}