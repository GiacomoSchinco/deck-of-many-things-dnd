// components/character/creation-wizard/RaceClassCard.tsx
'use client';

import Image from 'next/image';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { cn } from '@/lib/utils';
import { CARD_SIZES } from '@/lib/utils/cardSizes';

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

const sizeMap = CARD_SIZES;

export function RaceClassCard({
  id,
  name,
  type,
  isSelected = false,
  onSelect,
  size = 'md',
  disabled = false
}: RaceClassCardProps) {

  //const englishName = getEnglishName(name, type);
  const folder = type === 'race' ? 'races' : 'classes';
  const isInteractive = !!onSelect;

  const inner = (
    <AncientCardContainer className="w-full h-full overflow-hidden p-0 relative group">
      {/* Immagine di sfondo della carta */}
      <div className="absolute inset-0">
        <Image
          src={`/images/${folder}/card_${name}.png`}
          alt={name}
          fill
          className="object-fill"
          loading="eager"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>

      {/* Bordo selezione */}
      {isSelected && (
        <>
          <div className="absolute inset-0 rounded-lg pointer-events-none" />
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Selezionata!
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
        'relative transition-all duration-300 focus:outline-none',
        sizeMap[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
      )}
    >
      {inner}
    </button>
  );
}