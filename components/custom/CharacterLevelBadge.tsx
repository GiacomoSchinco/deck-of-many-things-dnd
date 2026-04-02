// components/custom/CharacterLevelBadge.tsx
'use client';

import { cn } from '@/lib/utils';

interface CharacterLevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;  // label personalizzabile
  className?: string;
}

const sizeClasses = {
  sm: {
    wrapper: 'w-10 h-10',
    number: 'text-base font-bold',
  },
  md: {
    wrapper: 'w-14 h-14',
    number: 'text-xl font-bold',
  },
  lg: {
    wrapper: 'w-20 h-20',
    number: 'text-3xl font-bold',
  },
};

export function CharacterLevelBadge({
  level,
  size = 'md',
  showLabel = false,
  label,
  className,
}: CharacterLevelBadgeProps) {
  const sizeStyle = sizeClasses[size];

  // Calcola il colore del bordo in base al livello
  const getBorderColor = () => {
    if (level >= 17) return 'border-amber-400 shadow-amber-500/30';
    if (level >= 13) return 'border-amber-500 shadow-amber-500/25';
    if (level >= 9) return 'border-amber-600 shadow-amber-600/20';
    if (level >= 5) return 'border-amber-700 shadow-amber-700/15';
    return 'border-amber-800 shadow-amber-800/10';
  };

  const defaultLabel = `Livello ${level}`;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      {/* Anello decorativo esterno */}
      <div
        className={cn(
          'relative rounded-full border-2 bg-gradient-to-br from-amber-800 to-amber-950',
          'flex items-center justify-center shadow-lg',
          getBorderColor(),
          sizeStyle.wrapper
        )}
      >
        {/* Effetto pergamena interna */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-amber-700/30 to-amber-900/50" />

        {/* Numero */}
        <span className={cn('relative z-10 font-serif text-amber-200', sizeStyle.number)}>
          {level}
        </span>

        {/* Decorazioni angolari */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-amber-500/50 rounded-tl-full" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-amber-500/50 rounded-tr-full" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-amber-500/50 rounded-bl-full" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-amber-500/50 rounded-br-full" />
      </div>

      {/* Label opzionale */}
      {showLabel && (
        <div className="mt-1.5 text-center">
          <span className={cn('font-serif text-xs text-amber-600', size === 'sm' && 'text-[10px]')}>
            {label || defaultLabel}
          </span>
        </div>
      )}
    </div>
  );
}