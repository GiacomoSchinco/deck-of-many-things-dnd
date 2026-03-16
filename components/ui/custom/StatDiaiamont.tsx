type StatDiamondProps = {
  label: string;
  value: number;
  modifier: number;
  raceBonuses: Record<string, number>;
};

export default function StatDiamond({ label, value, modifier, raceBonuses={} }: StatDiamondProps) {
  return (
    <div className="flex flex-col items-center gap-2 mx-2 my-2 group">
      
      {/* Contenitore modificatore e rombo */}
      <div className="relative flex flex-col items-center">
        
        {/* Modificatore (sopra) - stile antico */}
        <div className="absolute -top-3 w-10 h-8 bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-antique-gold rounded-md flex items-center justify-center shadow-lg z-10 transform hover:scale-110 transition-transform">
          {/* Texture fine */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 4px)`,
          }} />
          <span className="text-amber-100 font-bold text-lg drop-shadow-md">
            {modifier >= 0 ? `+${modifier}` : modifier}
          </span>
          {/* Piccoli chiodi decorativi */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-antique-gold rounded-full" />
        </div>

        {/* Rombo stat - con effetto carta antica */}
        <div className="relative w-20 h-20 mt-4">
          {/* Ombra esterna */}
          <div className="absolute inset-0 bg-amber-950/30 blur-md rounded-lg transform rotate-45 scale-105" />
          
          {/* Rombo principale */}
          <div
            className={`
              absolute inset-0
              bg-gradient-to-br from-amber-100 to-parchment-200
              border-2 border-antique-gold
              rounded-lg
              rotate-45
              flex items-center justify-center
              shadow-xl
              group-hover:shadow-2xl
              group-hover:scale-105
              transition-all duration-300
              overflow-hidden
            `}
          >
            {/* Texture pergamena */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `repeating-linear-gradient(45deg, #8B5A2B 0px, #8B5A2B 1px, transparent 1px, transparent 6px)`,
            }} />
            
            {/* Valore numerico (controrotato) */}
            <span className="relative z-10 text-amber-900 font-bold text-3xl rotate-[-45deg] drop-shadow-md">
              {value}
            </span>

            {/* Decorazioni angolari */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-antique-gold/30" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-antique-gold/30" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-antique-gold/30" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-antique-gold/30" />
          </div>

          {/* Piccolo glitter agli angoli del rombo */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-antique-gold/30 rounded-full blur-[1px]" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-antique-gold/30 rounded-full blur-[1px]" />
        </div>
      </div>

      {/* Label con stile fantasy */}
      <span className="relative font-serif font-semibold text-base text-amber-900 tracking-wide mt-3 px-3 py-1">
        {label}
        {/* Sottolineatura decorativa */}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-antique-gold to-transparent" />
      </span>
    </div>
  );
}