// components/custom/SpellCard.tsx
'use client';

import React from 'react';
import AncientCardContainer from './AncientCardContainer';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Clock,
  Target,
  Hourglass,
  ScrollText,
  Crown,
  Star,
  Info,
} from 'lucide-react';
import { DndIcon } from '../icons/DndIcon';
import { getItalianSchool } from '@/lib/utils/nameMappers';
import type { Spell } from '@/types/spell';

interface SpellCardProps {
  spell: Spell;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

// Mappa delle icone per scuola (usate anche per il badge colorato)
const schoolConfig: Record<string, { color: string; bgLight: string }> = {
  abjuration:    {   color: 'text-blue-600', bgLight: 'bg-blue-50' },
  conjuration:   {     color: 'text-purple-600', bgLight: 'bg-purple-50' },
  divination:    {      color: 'text-indigo-600', bgLight: 'bg-indigo-50' },
  enchantment:   {     color: 'text-pink-600', bgLight: 'bg-pink-50' },
  evocation:     {       color: 'text-orange-600', bgLight: 'bg-orange-50' },
  illusion:      {      color: 'text-cyan-600', bgLight: 'bg-cyan-50' },
  necromancy:    {     color: 'text-gray-600', bgLight: 'bg-gray-100' },
  transmutation: {    color: 'text-emerald-600', bgLight: 'bg-emerald-50' },
};

// Mappa dei livelli (per icone)
const levelConfig: Record<number, { icon: React.ElementType; label: string }> = {
  0: { icon: Sparkles, label: 'Trucchetto' },
  1: { icon: Star, label: '1° Livello' },
  2: { icon: Star, label: '2° Livello' },
  3: { icon: Star, label: '3° Livello' },
  4: { icon: Star, label: '4° Livello' },
  5: { icon: Star, label: '5° Livello' },
  6: { icon: Crown, label: '6° Livello' },
  7: { icon: Crown, label: '7° Livello' },
  8: { icon: Crown, label: '8° Livello' },
  9: { icon: Crown, label: '9° Livello' },
};

export default function SpellCard({ spell, showActions = false, onEdit, onDelete, size = 'md' }: SpellCardProps) {
  const [showDesc, setShowDesc] = React.useState(false);

  const schoolInfo = schoolConfig[spell.school] || { color: 'text-amber-600', bgLight: 'bg-amber-50' };
  const LevelIcon = levelConfig[spell.level]?.icon || Star;
  const levelLabel = levelConfig[spell.level]?.label || `${spell.level}° Livello`;

  // Formatta i componenti
  const formatComponents = () => {
    const comp = spell.components;
    if (!comp) return '—';
    if (Array.isArray(comp)) {
      const text = comp.join(', ');
      if (comp.includes('M') && spell.material) {
        return <span>{text} <span className="text-xs text-amber-500">({spell.material})</span></span>;
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
        {comp.material && <span className="text-xs text-amber-500 block">({comp.material})</span>}
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
              className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold bg-white text-amber-700 border border-amber-200 rounded-full shadow-sm"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {showDesc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowDesc(false)} />
              <div className="bg-white p-4 rounded-lg max-w-lg mx-4 z-10 shadow-lg border border-amber-100">
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
          <span className={cn('text-xs font-medium', schoolInfo.color)}>{getItalianSchool(spell.school)}</span>
          {spell.ritual && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Rituale</span>
          )}
          {spell.concentration && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Concentrazione</span>
          )}
        </div>
      </div>

      {/* Icona scuola centrata + livello */}
      <div className="flex flex-col items-center justify-center mt-3 gap-1">
        <DndIcon name={spell.school} className={schoolInfo.color} size={70} />
        <div className="flex items-center gap-1 text-xs text-amber-600">
          <LevelIcon className="w-3 h-3" />
          <span>{levelLabel}</span>
        </div>
      </div>

      {/* Statistiche: tempo di lancio, gittata, durata, componenti */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div className="bg-amber-50/50 p-1.5 rounded text-center flex flex-col items-center gap-0.5">
          <Clock className="w-3 h-3 text-amber-500" />
          <span className="text-amber-800">{spell.casting_time || '—'}</span>
        </div>
        <div className="bg-amber-50/50 p-1.5 rounded text-center flex flex-col items-center gap-0.5">
          <Target className="w-3 h-3 text-amber-500" />
          <span className="text-amber-800">{spell.range || '—'}</span>
        </div>
        <div className="bg-amber-50/50 p-1.5 rounded text-center flex flex-col items-center gap-0.5">
          <Hourglass className="w-3 h-3 text-amber-500" />
          <span className="text-amber-800">{spell.duration || '—'}</span>
        </div>
        <div className="bg-amber-50/50 p-1.5 rounded text-center flex flex-col items-center gap-0.5">
          <ScrollText className="w-3 h-3 text-amber-500" />
          <span className="text-amber-800">{formatComponents()}</span>
        </div>
      </div>

      {/* Azioni opzionali (modifica/elimina) */}
      {showActions && (
        <div className="flex justify-center gap-2 mt-4 pt-2 border-t border-amber-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-xs bg-amber-700 text-amber-100 rounded hover:bg-amber-800 transition-colors"
            >
              Modifica
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-xs bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
            >
              Elimina
            </button>
          )}
        </div>
      )}

      {/* Effetto hover decorativo */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-amber-400/30 rounded-xl transition-all duration-300" />
    </AncientCardContainer>
  );
}