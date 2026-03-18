// components/character/creation-wizard/RaceClassCard.tsx
'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import { cn } from '@/lib/utils';
import { getEnglishName } from '@/lib/utils/nameMappers';

// Mappa nomi italiani → inglese per razze

interface RaceClassCardProps {
  id?: number;
  name: string; // nome in italiano
  type: 'race' | 'class';
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeMap = {
  sm: 'w-40 h-64',
  md: 'w-48 h-75',
  lg: 'w-64 h-96',
};

export function RaceClassCard({
  id,
  name,
  type,
  isSelected = false,
  onSelect,
  size = 'md',
  disabled = false
}: RaceClassCardProps) {
  
  const englishName = getEnglishName(name, type);
  const folder = type === 'race' ? 'races' : 'classes';
  const isInteractive = !!onSelect;

  const inner = (
    <AncientCardContainer className="w-full h-full overflow-hidden p-0 relative group">
      {/* Immagine di sfondo della carta */}
      <div className="absolute inset-0">
        <Image
          src={`/images/${folder}/card_${englishName}.png`}
          alt={name}
          fill
          className="object-fit: cover"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>

      {/* Bordo selezione */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-4 border-antique-gold rounded-lg pointer-events-none" />
          <div className="absolute top-2 right-2 bg-antique-gold rounded-full p-1">
            <Check className="w-4 h-4 text-amber-950" />
          </div>
        </>
      )}

      {/* Effetto shine all'hover (solo se interattiva) */}
      {isInteractive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none" />
      )}
    </AncientCardContainer>
  );

  if (!isInteractive) {
    return (
      <div className={cn('relative', sizeMap[size])}>
        {inner}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect!(id!)}
      disabled={disabled}
      className={cn(
        'relative transition-all duration-300 transform hover:scale-105 focus:outline-none',
        sizeMap[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
      )}
    >
      {inner}
    </button>
  );
}