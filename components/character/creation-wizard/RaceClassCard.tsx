// components/character/creation-wizard/RaceClassCard.tsx
'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import { cn } from '@/lib/utils';

interface RaceClassCardProps {
  id: number;
  name: string;
  imageName: string; // nome del file senza estensione (es. "human", "warrior")
  type: 'race' | 'class';
  isSelected: boolean;
  onSelect: (id: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

export function RaceClassCard({
  id,
  name,
  imageName,
  type,
  isSelected,
  onSelect,
  size = 'md',
  disabled = false
}: RaceClassCardProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      disabled={disabled}
      className={cn(
        'relative transition-all duration-300 transform hover:scale-105 focus:outline-none',
        sizeMap[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
      )}
    >
      <AncientCardContainer className="w-full h-full overflow-hidden p-0 relative group">
        {/* Immagine di sfondo della carta */}
        <div className="absolute inset-0">
          <Image
            src={`/images/${type}s/card_${imageName}.png`}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        </div>

        {/* Overlay scuro per leggibilità nome */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-950/80 to-transparent p-4">
          <h3 className="font-serif font-bold text-amber-100 text-xl text-center">
            {name}
          </h3>
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

        {/* Effetto shine all'hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none" />
      </AncientCardContainer>
    </button>
  );
}