// components/ui/custom/FanCardGroup.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import AncientCardContainer from './AncientCardContainer';

export type CardSize = 'sm' | 'md' | 'lg';

interface FanCardGroupProps {
  children: ReactNode[];
  size?: CardSize;
  className?: string;
  cardClassName?: string;
}

const sizeMap = {
  sm: 'w-40 h-64',
  md: 'w-48 h-75',
  lg: 'w-64 h-96',
};

const fanPositions = [
  { rotate: '-3deg', marginLeft: '0px', zIndex: 1 },
  { rotate: '-1deg', marginLeft: '-25px', zIndex: 2 },
  { rotate: '1deg', marginLeft: '-25px', zIndex: 2 },
  { rotate: '3deg', marginLeft: '-25px', zIndex: 1 },
];

export function FanCardGroup({ 
  children, 
  size = 'md',
  className,
  cardClassName
}: FanCardGroupProps) {
  
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {children.map((child, index) => {
        const pos = fanPositions[index] || { rotate: '0deg', marginLeft: '-20px', zIndex: 1 };
        
        return (
          <div
            key={index}
            className={cn(
              "relative transition-all duration-300 hover:scale-105 hover:z-20",
              sizeMap[size]
            )}
            style={{
              transform: `rotate(${pos.rotate})`,
              marginLeft: index === 0 ? '0px' : pos.marginLeft,
              zIndex: pos.zIndex,
            }}
          >
            <AncientCardContainer className={cn("w-full h-full", cardClassName)}>
              {child}
            </AncientCardContainer>
          </div>
        );
      })}
    </div>
  );
}