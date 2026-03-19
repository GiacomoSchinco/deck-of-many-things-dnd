// components/ui/custom/FanCardGroup.tsx
'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AncientCardContainer from './AncientCardContainer';
import { CARD_SIZES, type CardSize } from '@/lib/utils/cardSizes';

interface FanCardGroupProps {
  children: ReactNode;
  size?: CardSize; // le dimensioni sono fisse in base a questa prop
  className?: string;
  cardClassName?: string;
  spread?: 'tight' | 'normal' | 'wide';
  noWrapper?: boolean; // salta AncientCardContainer se i figli hanno già il loro container
}

// Genera posizioni dinamiche in base al numero di elementi
const generateFanPositions = (count: number, spread: 'tight' | 'normal' | 'wide') => {
  if (count === 1) return [{ rotate: '0deg', marginLeft: '0px', zIndex: 1 }];
  
  const spreadMap = {
    tight: 15,
    normal: 25,
    wide: 35,
  };
  
  const marginValue = spreadMap[spread];
  const angleStep = Math.min(8, 20 / count); // riduci l'angolo se ci sono tante carte
  const startAngle = -((count - 1) * angleStep) / 2;
  
  return Array.from({ length: count }).map((_, index) => ({
    rotate: `${startAngle + index * angleStep}deg`,
    marginLeft: index === 0 ? '0px' : `-${marginValue}px`,
    zIndex: index, // semplice: ultima carta sopra
  }));
};

export function FanCardGroup({ 
  children, 
  size = 'md',
  spread = 'normal',
  className,
  cardClassName,
  noWrapper = false,
}: FanCardGroupProps) {
  
  const items = React.Children.toArray(children);
  const positions = generateFanPositions(items.length, spread);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {items.map((child, index) => {
        const pos = positions[index];
        
        return (
          <div
            key={index}
            className={cn(
              "relative transition-all duration-300 hover:scale-105 hover:z-20 overflow-hidden shrink-0",
              CARD_SIZES[size] // ← dimensioni FISSE in base alla prop size
            )}
            style={{
              transform: `rotate(${pos.rotate})`,
              marginLeft: pos.marginLeft,
              zIndex: pos.zIndex,
            }}
          >
            {noWrapper ? child : (
              <AncientCardContainer className={cn("w-full h-full", cardClassName)}>
                {child}
              </AncientCardContainer>
            )}
          </div>
        );
      })}
    </div>
  );
}