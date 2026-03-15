// components/ui/AncientScroll.tsx
import React from 'react';

interface AncientScrollProps {
  children: React.ReactNode;
  className?: string;
}

const AncientScroll: React.FC<AncientScrollProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Strati pergamena sovrapposti (effetto spessore) */}
      <div className="absolute inset-0 bg-amber-100 rounded-xl border-4 border-amber-800 shadow-xl transform rotate-1" />
      <div className="absolute inset-0 bg-amber-100 rounded-xl border-4 border-amber-800 shadow-xl transform -rotate-1" />
      {/* Contenuto principale */}
      <div className="relative bg-amber-50 rounded-xl border-4 border-amber-800 shadow-xl p-6">
        {/* Texture pergamena */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 rounded-xl pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        {/* Contenuto */}
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AncientScroll;
