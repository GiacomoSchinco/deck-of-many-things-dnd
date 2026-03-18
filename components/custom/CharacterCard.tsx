// components/CharacterCard.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AncientCardContainer from './AncientCardContainer';
import HpBar from './HpBar';
import CardBack from './CardBack';
import { cn } from '@/lib/utils';
import { CardSize, CARD_SIZES } from '@/lib/utils/cardSizes';

interface CharacterCardProps {
  id: number;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  background: string;
  alignment: string;
  hp: number;
  maxhp: number;
  isFlippable?: boolean;
  size?: CardSize; // ← aggiungi questa prop
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  id,
  name,
  race,
  characterClass,
  level,
  background,
  alignment,
  hp,
  maxhp,
  isFlippable = false,
  size = 'md' 
  
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  const renderFront = () => (
    <AncientCardContainer className="w-full h-full" padded={false}>
      {/* Contenuto principale */}
      <div className="relative h-full flex flex-col p-4">
        {/* Nome e allineamento */}
        <div className="text-center border-b-2 border-amber-700/30 pb-2">
          <h2 className="text-lg font-bold text-amber-900 font-serif truncate">{name}</h2>
          <p className="text-xs text-amber-700">{alignment}</p>
        </div>
        
        {/* Barra HP */}
        <HpBar current={hp} max={maxhp} />
        
        {/* Immagine personaggio */}
        <div className="flex-1 flex items-center justify-center my-1">
          <div className="relative w-24 h-24 rounded-full border-2 border-amber-700/50 overflow-hidden bg-parchment-200/50 shadow-lg">   
            <Image
              src={`/images/classes/token_${characterClass.toLowerCase()}.png`}
              alt={characterClass}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Info principali */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-parchment-300/50 p-1.5 rounded text-center">
            <span className="text-amber-800 font-semibold">Razza</span>
            <p className="text-xs text-amber-900">{race}</p>
          </div>
          <div className="bg-parchment-300/50 p-1.5 rounded text-center">
            <span className="text-amber-800 font-semibold">Classe</span>
            <p className="text-xs text-amber-900">{characterClass}</p>
          </div>
          <div className="bg-parchment-300/50 p-1.5 rounded text-center">
            <span className="text-amber-800 font-semibold">Livello</span>
            <p className="text-xs text-amber-900">{level}</p>
          </div>
          <div className="bg-parchment-300/50 p-1.5 rounded text-center">
            <span className="text-amber-800 font-semibold">Background</span>
            <p className="text-xs text-amber-900 truncate">{background}</p>
          </div>
        </div>
        
        {/* Pulsante Dettagli con classi utility */}
        <div className="flex justify-center mt-3">
          <Link href={`/characters/${id}`}>
            <button className={cn(
              "relative px-6 py-1.5",
              "bg-amber-700 text-amber-100 text-sm font-serif tracking-wide",
              "rounded-sm border-2 border-amber-900",
              "shadow-md hover:shadow-lg",
              "hover:bg-amber-800 hover:border-amber-950 hover:text-amber-50",
              "active:translate-y-0.5 transition-all duration-200",
              "before:content-[''] before:absolute before:inset-0",
              "before:border before:border-amber-500/30 before:rounded-sm before:pointer-events-none",
              "overflow-hidden",
              "hover-lift" // ← nostra utility class
            )}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-amber-300 text-xs">⚔️</span>
                Dettagli
                <span className="text-amber-300 text-xs">🛡️</span>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </AncientCardContainer>
  );



  return (
    <div 
      className={`relative cursor-pointer transition-all duration-700 transform-gpu preserve-3d ${
        isFlipped ? 'rotate-y-180' : ''
      } ${CARD_SIZES[size]}`}
      onClick={() => isFlippable && setIsFlipped(!isFlipped)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute w-full h-full backface-hidden">
        {renderFront()}
      </div>
      <div className="absolute w-full h-full backface-hidden rotate-y-180">
        <CardBack />
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default CharacterCard;