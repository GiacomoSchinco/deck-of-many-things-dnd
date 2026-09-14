// components/custom/CharacterCard.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AncientCardContainer from './AncientCardContainer';
import HpBar from './HpBar';
import CardBack from './CardBack';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';
import { Scale, ScrollText, Sword, User } from 'lucide-react';
import { CardSize, CARD_SIZES } from '@/lib/utils/cardSizes';
import { getItalianClass, getItalianRace } from '@/lib/utils/nameMappers';
import { CharacterLevelBadge } from './CharacterLevelBadge';

interface CharacterCardProps {
  id: number;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  background: string;
  alignment: string;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  isFlippable?: boolean;
  size?: CardSize;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  id,
  name,
  race,
  characterClass,
  level,
  background,
  alignment,
  currentHp,
  maxHp,
  tempHp,
  isFlippable = false,
  size = 'md' 
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  const renderFront = () => (
    <AncientCardContainer className="w-full h-full" padded={false}>
      <div className="relative h-full flex flex-col p-6">
        {/* Header: Nome e Livello */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-amber-700/30">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-amber-900 font-serif truncate">
              {name}
            </h2>
          </div>
          <CharacterLevelBadge level={level} size="sm" showLabel={false} />
        </div>

        {/* Razza e Allineamento */}
        <div className="flex items-center justify-between gap-2 mt-1 mb-1">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-frame" aria-hidden="true" />
            <span className="text-sm font-serif font-medium text-amber-800">
              {getItalianRace(race)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Scale className="h-3.5 w-3.5 text-frame" aria-hidden="true" />
            <span className="text-sm font-serif text-amber-700">
              {alignment}
            </span>
          </div>
        </div>

        {/* Barra HP */}
        {currentHp !== undefined && maxHp !== undefined && (
          <HpBar size='small' current={currentHp} max={maxHp} tempHp={tempHp} />
        )}

        {/* Immagine personaggio */}
        <div className="flex-1 flex items-center justify-center my-2">
          <div className="relative w-28 h-28 rounded-full border-2 border-amber-700/50 overflow-hidden bg-parchment-200/50 shadow-lg group">
            <Image
              src={`/images/classes/token_${characterClass.toLowerCase()}.png`}
              alt={getItalianClass(characterClass)}
              fill
              sizes="112px"
              className="object-cover"
            />
            {/* Nome classe sovrapposto */}
            <div className="absolute inset-x-0 top-0 text-center py-1 bg-gradient-to-b from-black/80 to-transparent rounded-t-full">
              <span className="text-amber-200 text-[10px] font-serif tracking-wide font-semibold drop-shadow-md">
                {getItalianClass(characterClass).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="text-center mt-1">
          <ScrollText className="mr-1 inline h-3.5 w-3.5 text-frame" aria-hidden="true" />
          <span className="text-xs font-serif text-amber-700 ml-1">{background}</span>
        </div>

        {/* Pulsante Dettagli */}
        <div className="flex justify-center mt-3">
          <Link
            href={`/characters/${id}`}
            className={cn(buttonVariants({ size: 'sm' }), 'gap-2 px-6 py-1.5 font-serif tracking-wide')}
          >
            <Sword className="h-4 w-4" aria-hidden="true" />
            Dettagli
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