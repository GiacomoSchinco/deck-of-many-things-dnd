// components/custom/HpBar.tsx
'use client';

import { cn } from '@/lib/utils';
import { Heart, Shield, Skull } from 'lucide-react';

interface HpBarProps {
  current: number;
  max: number;
  tempHp?: number;
  size?: 'small' | 'large';
  showIcon?: boolean;
  className?: string;
}

export default function HpBar({ 
  current, 
  max, 
  tempHp = 0, 
  size = 'small', 
  showIcon = true,
  className 
}: HpBarProps) {
  // Calcola la percentuale di HP
  const percent = Math.min(100, (current / max) * 100);
  
  // Dimensioni
  const barHeight = size === 'large' ? 'h-8' : 'h-6';
  const textClass = size === 'large' ? 'text-sm' : 'text-xs';
  const valueClass = size === 'large' ? 'text-base font-bold' : 'text-sm font-bold';
  const iconSize = size === 'large' ? 'w-4 h-4' : 'w-3 h-3';
  
  // Colore dinamico in base alla percentuale
  const getBarColor = () => {
    if (percent <= 25) return 'bg-destructive';
    if (percent <= 50) return 'bg-antique-bronze';
    if (percent <= 75) return 'bg-antique-gold';
    return 'bg-success';
  };

  return (
    <div className={cn('space-y-1', className)}>
      {/* Barra HP con contenuto sovrapposto */}
      <div className="relative">
        {/* Canale scavato nel materiale: il binario è una scanalatura scura con
            ombra interna, non un rettangolo piatto. Il riempimento ha un
            riflesso in alto, così la barra sembra un liquido e non una toppa. */}
        <div
          className={cn(
            'w-full overflow-hidden rounded-full bg-frame-deep border border-black/25 shadow-inset-2',
            barHeight
          )}
        >
          <div
            className={cn(
              'relative h-full rounded-full transition-[width] duration-500 ease-soft',
              getBarColor()
            )}
            style={{ width: `${percent}%` }}
          >
            <span
              className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/25"
              aria-hidden="true"
            />
          </div>
        </div>
        
        {/* Contenuto sovrapposto (icona + numeri) */}
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <div className="flex items-center gap-1.5">
            {showIcon && (
              <div className="relative">
                <Heart className={cn('text-white drop-shadow-md', iconSize)} />
                {current <= 0 && (
                  <Skull className="absolute -top-1 -right-2 w-3 h-3 text-parchment-200" />
                )}
              </div>
            )}
            <span className={cn('font-mono font-bold text-white drop-shadow-md', valueClass)}>
              {current}/{max}
            </span>
          </div>
          
          {/* HP temporanei (opzionali) */}
          {tempHp > 0 && (
            <div className="flex items-center gap-1">
              <Shield className={cn('text-parchment-100 drop-shadow-md', iconSize)} />
              <span className={cn('font-medium text-parchment-50 drop-shadow-md', textClass)}>
                +{tempHp}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}