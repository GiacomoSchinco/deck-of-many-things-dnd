// components/layout/PageWrapper.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: 'default' | 'scroll' | 'minimal';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  withContainer?: boolean;
  showDecorations?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function PageWrapper({
  children,
  title,
  subtitle,
  icon,
  action,
  className,
  contentClassName,
  variant = 'default',
  maxWidth = 'xl',
  withContainer = true,
  showDecorations = true,
}: PageWrapperProps) {
  
  const variantStyles = {
    default: {
      wrapper: 'bg-gradient-to-br from-amber-50/95 via-parchment-100 to-amber-100/90',
      border: 'border-2 border-amber-900/30',
      shadow: 'shadow-xl',
    },
    scroll: {
      wrapper: 'bg-gradient-to-b from-amber-50/95 to-amber-100/90',
      border: 'border-x-2 border-amber-800/30',
      shadow: 'shadow-2xl',
    },
    minimal: {
      wrapper: 'bg-amber-50/90',
      border: 'border border-amber-800/20',
      shadow: 'shadow-md',
    },
  };

  const style = variantStyles[variant];

  const content = (
    <div className={cn('relative overflow-hidden rounded-xl', style.border, style.shadow, style.wrapper, className)}>
      {/* Texture pergamena overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5 L35 20 L20 35 L5 20 Z' fill='none' stroke='%238B4513' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Decorazioni angolari */}
      {showDecorations && variant === 'default' && (
        <>
          <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-700/30 rounded-tl-xl" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-700/30 rounded-tr-xl" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-700/30 rounded-bl-xl" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-700/30 rounded-br-xl" />
        </>
      )}

      {/* Rotoli per variant scroll */}
      {showDecorations && variant === 'scroll' && (
        <>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-lg" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gradient-to-t from-amber-800 to-amber-900 rounded-b-lg" />
        </>
      )}

      {/* Contenuto principale */}
      <div className={cn('relative z-10 p-6 md:p-8', contentClassName)}>
        {/* Header */}
        {(title || subtitle || action) && (
          <div className="mb-6 pb-4 border-b-2 border-amber-700/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 rounded-lg bg-amber-100/50 border border-amber-700/30">
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-900">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-amber-600 text-sm mt-1 font-serif italic">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              {action && <div>{action}</div>}
            </div>
          </div>
        )}

        {children}

        {/* Footer decorativo */}
        {showDecorations && (
          <div className="mt-8 pt-4 text-center">
            <div className="inline-flex items-center gap-2 text-amber-400/40 text-sm">
              <span>⚔️</span>
              <span>✧</span>
              <span>🛡️</span>
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

// Versione semplice senza decorazioni
export function SimplePageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('container mx-auto p-4 md:p-6 max-w-7xl', className)}>
      <div className="bg-gradient-to-br from-amber-50/90 to-amber-100/80 rounded-xl border border-amber-900/20 shadow-md p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}