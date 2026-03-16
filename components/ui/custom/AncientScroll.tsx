// components/ui/custom/AncientScroll.tsx
'use client';

import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

interface AncientScrollProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rolled' | 'open';
  texture?: boolean;
  watermark?: boolean;
}

export const AncientScroll = forwardRef<HTMLDivElement, AncientScrollProps>(
  ({ className, variant = 'default', texture = true, watermark = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg p-8 shadow-2xl', // più padding
          'bg-gradient-to-br from-amber-50 via-parchment-100 to-amber-100',
          'border-2 border-amber-900/40',
          variant === 'rolled' && 'rounded-l-none border-l-[40px] border-l-amber-800 pl-8', // più spazio a sinistra
          variant === 'open' && 'shadow-2xl scale-100',
          className
        )}
        {...props}
      >
        {/* 🎨 FILIGRANA DI FONDO */}
        {watermark && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%238B5A2B' stroke-width='0.5'/%3E%3C/svg%3E"),
                repeating-linear-gradient(45deg, rgba(139,69,19,0.1) 0px, rgba(139,69,19,0.1) 2px, transparent 2px, transparent 8px)
              `,
              backgroundSize: '60px 60px, 8px 8px',
              backgroundBlendMode: 'overlay',
            }}
          />
        )}

        {/* 📜 TEXTURE PERGAMENA ORIGINALE */}
        {texture && (
          <>
            {/* Linee orizzontali più sottili */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-5"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 23px,
                    rgba(100, 50, 20, 0.1) 24px,
                    transparent 25px
                  )
                `,
                backgroundSize: '100% 25px',
              }}
            />
            
            {/* Texture "velluto" della carta */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-5"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(139,69,19,0.1) 0px, transparent 20%),
                  radial-gradient(circle at 80% 70%, rgba(101,67,33,0.1) 0px, transparent 30%),
                  repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 6px)
                `,
              }}
            />
          </>
        )}

        {/* 🔥 BORDI BRUCIACCHIATI PIÙ SFUMATI */}
 

        {/* ⚜️ DECORAZIONI AGLI ANGOLI */}
        <div className="absolute top-3 left-3 text-antique-gold/20 text-2xl font-serif transform rotate-12">⚜️</div>
        <div className="absolute top-3 right-3 text-antique-gold/20 text-2xl font-serif transform -rotate-12">⚜️</div>
        <div className="absolute bottom-3 left-3 text-antique-gold/20 text-2xl font-serif transform -rotate-12">⚜️</div>
        <div className="absolute bottom-3 right-3 text-antique-gold/20 text-2xl font-serif transform rotate-12">⚜️</div>

        {/* 🖋️ MACCHIE D'INCHIOSTRO (effetto vintage) */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-amber-800/5 rounded-full blur-xl" />
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-amber-900/5 rounded-full blur-2xl" />

        {/* 📦 BORDO DECORATIVO INTERNO */}
        <div className="absolute inset-3 border border-antique-gold/10 rounded-lg pointer-events-none" />

        {/* 🌿 PER ROLLED - EFFETTO LEGNO MIGLIORATO */}
        {variant === 'rolled' && (
          <>
            <div className="absolute left-[-40px] top-0 bottom-0 w-[40px] bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-l-lg shadow-2xl" />
            
            {/* Venature del legno */}
            <div className="absolute left-[-38px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-antique-gold/30 via-transparent to-antique-gold/30" />
            <div className="absolute left-[-30px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-600/20 via-transparent to-amber-600/20" />
            <div className="absolute left-[-20px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-600/20 via-transparent to-amber-600/20" />
            
            {/* Chiodi decorativi */}
            <div className="absolute left-[-30px] top-4 w-3 h-3 rounded-full bg-gradient-to-br from-antique-gold to-amber-700 shadow-lg" />
            <div className="absolute left-[-30px] bottom-4 w-3 h-3 rounded-full bg-gradient-to-br from-antique-gold to-amber-700 shadow-lg" />
            
            {/* Legatura in pelle */}
            <div className="absolute left-[-35px] top-1/2 transform -translate-y-1/2 w-5 h-12 bg-gradient-to-b from-amber-800 to-amber-950 rounded-full opacity-80 shadow-inner" />
          </>
        )}

        {/* Contenuto principale - con z-index alto */}
        <div className="relative z-20">
          {children}
        </div>
      </div>
    );
  }
);

AncientScroll.displayName = 'AncientScroll';