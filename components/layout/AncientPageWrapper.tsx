// components/layout/AncientPageWrapper.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollText, Sparkles } from 'lucide-react';

interface AncientPageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showDecorations?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  withContainer?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function AncientPageWrapper({
  children,
  title,
  subtitle,
  icon,
  action,
  className,
  contentClassName,
  showDecorations = true,
  maxWidth = 'xl',
  withContainer = true,
}: AncientPageWrapperProps) {
  const content = (
    <div className={cn('relative', className)}>
      {/* Sfondo pergamena */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 via-parchment-100 to-amber-100/80 rounded-xl" />
      
      {/* Texture pergamena overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B4513' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Decorazioni angolari */}
      {showDecorations && (
        <>
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-700/30 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-700/30 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-700/30 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-700/30 rounded-br-xl pointer-events-none" />
        </>
      )}

      {/* Elementi fluttuanti decorativi */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-8 text-amber-900/5 text-6xl animate-float">⚔️</div>
          <div className="absolute bottom-20 right-8 text-amber-900/5 text-6xl animate-float delay-200">🛡️</div>
          <div className="absolute top-1/3 right-12 text-amber-900/5 text-4xl animate-float delay-400">🎲</div>
          <div className="absolute bottom-1/3 left-12 text-amber-900/5 text-4xl animate-float delay-600">📜</div>
        </div>
      )}

      {/* Contenuto principale */}
      <div className={cn('relative z-10 p-6 md:p-8', contentClassName)}>
        {/* Header con titolo e azioni */}
        {(title || subtitle || action) && (
          <div className="mb-6 pb-4 border-b-2 border-amber-700/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 rounded-lg bg-amber-100/50 border border-amber-700/30">
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-amber-900">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-amber-600 text-sm md:text-base mt-1 font-serif italic">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              {action && <div>{action}</div>}
            </div>
          </div>
        )}

        {/* Children */}
        {children}

        {/* Footer decorativo */}
        {showDecorations && (
          <div className="mt-8 pt-4 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-amber-400/60">
              <span>✧</span>
              <span>✧</span>
              <span>✧</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!withContainer) {
    return content;
  }

  return (
    <div className={cn('container mx-auto p-4 md:p-6', maxWidthClasses[maxWidth])}>
      {content}
    </div>
  );
}

// Versione più compatta per pagine semplici
export function SimpleAncientPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('container mx-auto p-4 md:p-6 max-w-7xl', className)}>
      <div className="relative bg-gradient-to-br from-amber-50/90 via-parchment-100 to-amber-100/80 rounded-xl border-2 border-amber-900/30 shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%238B4513' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="relative z-10 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

// Versione per schede personaggio (con effetto rollio)
export function ScrollPageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('container mx-auto p-4 md:p-6 max-w-5xl', className)}>
      <div className="relative">
        {/* Rotolo superiore */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-lg shadow-md" />
        
        {/* Contenuto pergamena */}
        <div className="relative bg-gradient-to-b from-amber-50/95 to-amber-100/90 rounded-xl border-x-2 border-amber-800/30 shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='%238B4513' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
          <div className="relative z-10 p-6 md:p-8">
            {children}
          </div>
        </div>
        
        {/* Rotolo inferiore */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-gradient-to-t from-amber-800 to-amber-900 rounded-b-lg shadow-md" />
      </div>
    </div>
  );
}