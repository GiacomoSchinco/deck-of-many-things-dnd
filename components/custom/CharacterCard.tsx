// components/custom/CharacterCard.tsx
"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AncientCardContainer from './AncientCardContainer';
import HpBar from './HpBar';
import CardBack from './CardBack';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { RefreshCw, Scale, ScrollText, Sword, User } from 'lucide-react';
import { CARD_SIZES, type CardSize } from '@/lib/utils/cardSizes';
import { getItalianClass, getItalianRace } from '@/lib/utils/nameMappers';
import { CharacterLevelBadge } from './CharacterLevelBadge';

interface CharacterCardProps {
  /** UUID del personaggio. Era dichiarato `number`, ma `types/character.ts`
   *  definisce `id: string` e i personaggi usano UUID. */
  id: string;
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
      <div className="relative flex h-full flex-col gap-3 p-6">
        {/* Testata: nome e livello */}
        <div className="flex items-center justify-between gap-2 border-b border-frame/25 pb-2">
          <h3 className="min-w-0 flex-1 truncate font-serif text-xl text-ink-strong">
            {name}
          </h3>
          <CharacterLevelBadge level={level} size="sm" showLabel={false} />
        </div>

        {/* Razza e allineamento */}
        <div className="flex items-center justify-between gap-2 font-serif text-sm">
          <span className="flex min-w-0 items-center gap-1.5 text-ink">
            <User className="h-3.5 w-3.5 shrink-0 text-frame" aria-hidden="true" />
            <span className="truncate">{getItalianRace(race)}</span>
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-ink-muted">
            <Scale className="h-3.5 w-3.5 shrink-0 text-frame" aria-hidden="true" />
            <span className="truncate">{alignment}</span>
          </span>
        </div>

        {/* Punti ferita */}
        {currentHp !== undefined && maxHp !== undefined && (
          <HpBar size="small" current={currentHp} max={maxHp} tempHp={tempHp} />
        )}

        {/* Ritratto della classe + etichetta.
            La classe era una fascia scura sovrapposta in cima all'immagine: la
            copriva e, essendo rettangolare su un cerchio, restava tagliata dal
            `rounded-full` con gli angoli mozzati. Ora è un'etichetta sotto il
            ritratto, che resta interamente visibile. */}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="surface-well relative h-24 w-24 overflow-hidden rounded-full border border-frame/30">
            <Image
              src={`/images/classes/token_${characterClass.toLowerCase()}.png`}
              alt={getItalianClass(characterClass)}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <Badge variant="outline" className="font-serif tracking-wide uppercase">
            {getItalianClass(characterClass)}
          </Badge>
        </div>

        {/* Background */}
        <p className="flex items-center justify-center gap-1.5 font-serif text-xs text-ink-muted">
          <ScrollText className="h-3.5 w-3.5 shrink-0 text-frame" aria-hidden="true" />
          <span className="truncate">{background}</span>
        </p>

        {/* Azione */}
        <div className="flex justify-center">
          <Link
            href={`/characters/${id}`}
            className={cn(buttonVariants({ size: 'sm' }), 'gap-2 px-6 font-serif tracking-wide')}
          >
            <Sword className="h-4 w-4" aria-hidden="true" />
            Dettagli
          </Link>
        </div>
      </div>
    </AncientCardContainer>
  );

  return (
    // `mx-auto` serve perché la card ha larghezza FISSA (CARD_SIZES): dentro una
    // cella di griglia più larga restava appoggiata a sinistra invece che centrata.
    <div className={cn('relative mx-auto', CARD_SIZES[size])}>
      <div
        className={cn(
          'relative h-full w-full transform-3d transition-transform duration-700',
          isFlipped && 'rotate-y-180',
        )}
      >
        <div className="absolute inset-0 backface-hidden">{renderFront()}</div>
        <div className="absolute inset-0 rotate-y-180 backface-hidden">
          <CardBack />
        </div>
      </div>

      {/* Il comando di ribaltamento sta FUORI dal contenitore che ruota (così
          resta raggiungibile anche a carta girata) e non è più un onClick sul
          contenitore: un click sul link "Dettagli" lo attivava di rimbalzo.
          Nota: sotto Turbopack lo styled-jsx non veniva applicato, quindi il
          vecchio blocco <style jsx> non produceva nessuna regola. */}
      {isFlippable && (
        <button
          type="button"
          onClick={() => setIsFlipped((flipped) => !flipped)}
          aria-pressed={isFlipped}
          aria-label={isFlipped ? 'Mostra il fronte della carta' : 'Mostra il retro della carta'}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
            'absolute bottom-2 left-2 z-10',
          )}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default CharacterCard;