// components/AncientCardContainer.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CARD_SIZES } from '@/lib/utils/cardSizes';

interface AncientCardContainerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDashed?: boolean;
  padded?: boolean;
  variant?: 'default' | 'add' | 'flipped' | 'transparent';
  size?: 'sm' | 'md' | 'lg' | 'auto';
}

const AncientCardContainer: React.FC<AncientCardContainerProps> = ({
  children,
  onClick,
  className = '',
  isDashed = false,
  padded = true,
  variant = 'default',
  size = 'auto',
}) => {
  const variantStyles = {
    default: { bg: 'bg-parchment-100', border: 'border-amber-800' },
    add: { bg: 'bg-parchment-100/90', border: 'border-amber-800 border-dashed' },
    flipped: { bg: 'bg-amber-800', border: 'border-amber-900' },
    transparent: { bg: 'bg-transparent', border: 'border-amber-800' },
  };

  const { bg, border } = variantStyles[variant];

  // Determina le classi di dimensione
  const sizeClasses = size !== 'auto' ? CARD_SIZES[size] : '';

  return (
    <div className={cn('relative', className)} onClick={onClick}>
      <div className={cn(
        'relative w-full h-full rounded-xl overflow-hidden border-8 shadow-2xl',
        bg,
        border,
        sizeClasses // Solo se non è 'auto'
      )}>
        {/* Texture noise con SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" opacity="0.3" />
          </svg>
        </div>

        {/* Gradient overlay */}
        {variant !== 'transparent' && (
          <div className="absolute inset-0 bg-gradient-to-br from-parchment-200/50 to-parchment-400/30 pointer-events-none" />
        )}

        {/* Bordo decorativo interno */}
        <div className={cn(
          'absolute inset-2 border-2 rounded-lg',
          isDashed ? 'border-amber-700/30 border-dashed' : 'border-amber-700/30'
        )} />

        {/* Angoli invecchiati */}
        <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-amber-900/20 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-amber-900/20 to-transparent rounded-tl-full" />

        {/* Macchie di invecchiamento */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-amber-800/10 rounded-full blur-sm" />
        <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-amber-800/10 rounded-full blur-md" />

        {/* Semi decorativi */}
        <div className="absolute top-4 left-4 text-3xl text-amber-800/20 pointer-events-none select-none">♠</div>
        <div className="absolute top-4 right-4 text-3xl text-amber-800/20 pointer-events-none select-none">♣</div>
        <div className="absolute bottom-4 left-4 text-3xl text-amber-800/20 pointer-events-none select-none">♥</div>
        <div className="absolute bottom-4 right-4 text-3xl text-amber-800/20 pointer-events-none select-none">♦</div>

        {/* Contenuto principale con padding condizionale */}
        <div className={cn(
          'relative h-full w-full',
          padded && 'p-10'
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AncientCardContainer;