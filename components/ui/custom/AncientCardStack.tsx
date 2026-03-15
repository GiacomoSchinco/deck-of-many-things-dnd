import React from 'react';
import AncientCardContainer from './AncientCardContainer';

interface AncientCardStackProps {
  children?: React.ReactNode; // contenuto per la carta superiore
  stackCount?: number; // quante carte nello stack (min 1)
  cardSize?: 'sm' | 'md' | 'lg';
  animation?: 'float' | string; // classe di animazione (es. 'animate-float')
}

// Use Tailwind width/height classes; md is canonical (w-64 h-80)
const sizeMap = {
  sm: 'w-56 h-72',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

export default function AncientCardStack({
  children,
  stackCount = 3,
  cardSize = 'md',
  animation = 'animate-float',
}: AncientCardStackProps) {
  const cl = sizeMap[cardSize] || sizeMap.md;
  const count = Math.max(1, Math.floor(stackCount));

  // generate simple offsets for back cards - solo rotate migliorato
  const offsets = Array.from({ length: count }, (_, i) => {
    const idx = i; // 0 = bottom
    
    // Rotazioni più carine e variate
    let rotate;
    if (idx === count - 1) {
      rotate = 0; // carta superiore dritta
    } else if (idx === 0) {
      rotate = 4; // carta in fondo leggermente ruotata
    } else if (idx === 1) {
      rotate = -2; // carta centrale ruotata in direzione opposta
    } else {
      rotate = idx % 2 === 0 ? 3 : -3; // alternanza per più di 3 carte
    }
    
    const tx = idx === 0 ? 2 : idx === 1 ? -1 : 0;
    const ty = idx === 0 ? 2 : idx === 1 ? -1 : 0;
    
    return { rotate, tx, ty };
  });

  return (
    <div className="relative">
      {/* Mazzo di carte animate */}
      <div className={`relative ${cl}`}>
        {offsets.map((o, idx) => {
          // render back cards for all except top (last)
          const isTop = idx === offsets.length - 1;
          if (!isTop) {
            return (
              <div
                key={idx}
                className={`absolute inset-0 rounded-xl border-8 border-amber-900 shadow-2xl transform rotate-${o.rotate} translate-x-${o.tx} translate-y-${o.ty} overflow-hidden`}
                style={{
                  transform: `rotate(${o.rotate}deg) translate(${o.tx}px, ${o.ty}px)`,
                }}
              >
                <div className="w-full h-full bg-amber-800">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 8px)`,
                    }}
                  />
                </div>
              </div>
            );
          }

          // top card - animated and contains children
          return (
            <div key={idx} className={`absolute inset-0 ${animation}`}>
              <AncientCardContainer className={`w-full h-full`}>
                {children}
              </AncientCardContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}