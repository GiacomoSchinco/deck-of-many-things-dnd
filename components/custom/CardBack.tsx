import React from 'react';
import { DndIcon } from '../icons/DndIcon';

const CardBack: React.FC = () => (
  <div className="relative w-full h-full bg-amber-800 rounded-xl overflow-hidden border-8 border-amber-900 shadow-2xl">
    {/* Pattern retro */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 8px)`,
      }}
    />
    
{/* Motivo centrale */}
    {/* Motivo centrale */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Cerchio esterno */}
        <div className="absolute inset-0 border-4 border-antique-gold/30 rounded-full" />
        {/* Cerchio medio */}
        <div className="absolute inset-2 border-2 border-antique-gold/20 rounded-full" />
        {/* Cerchio interno con icona */}
        <div className="absolute inset-4 bg-antique-gold/10 rounded-full flex items-center justify-center backdrop-blur-sm">
          <DndIcon name="rule-book" size={60} className="text-antique-gold/30" />
        </div>
      </div>
    </div>
  </div>
);

export default CardBack;

