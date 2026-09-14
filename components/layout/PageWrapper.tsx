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
  centerHeader?: boolean;
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
  maxWidth = 'lg',
  withContainer = true,
  showDecorations = true,
  centerHeader = false,
}: PageWrapperProps) {
  
  const variantStyles = {
    default: {
      wrapper: 'bg-parchment-100 text-ink',
      border: 'border-2 border-frame/40',
      shadow: 'shadow-frame',
    },
    scroll: {
      wrapper: 'bg-gradient-to-b from-parchment-100 via-parchment-200 to-parchment-100 text-ink',
      border: 'border-x-4 border-frame/50',
      shadow: 'shadow-frame',
    },
    minimal: {
      wrapper: 'bg-parchment-50 text-ink',
      border: 'border border-frame/25',
      shadow: 'shadow-sm',
    },
  };

  const style = variantStyles[variant];

  const content = (
    <div className={cn(
      'relative overflow-hidden rounded-frame w-full transition-all duration-500', 
      style.border, 
      style.shadow, 
      style.wrapper, 
      className
    )}>

      {/* Grana di carta (SVG inline, nessuna richiesta esterna) */}
      {variant !== 'minimal' && (
        <div className="absolute inset-0 pointer-events-none paper-grain opacity-[0.05]" />
      )}

      {/* Overlay Vignetta per effetto carta invecchiata */}
      {variant !== 'minimal' && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_60%,rgba(62,39,35,0.05)_100%)]" />
      )}

      {/* Decorazioni angolari "Filigrana Oro" */}
      {showDecorations && variant === 'default' && (
        <>
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-frame/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-frame/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-frame/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-frame/40 rounded-br-sm pointer-events-none" />
        </>
      )}

      {/* Rulli del papiro per variant scroll */}
      {showDecorations && variant === 'scroll' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent" />
      )}

      {/* Contenuto principale */}
      <div className={cn('relative z-10 p-6 md:p-10', contentClassName)}>
        {/* Header con separatore calligrafico */}
        {(title || subtitle || action) && (
          <div className="mb-8 group">
            <div className={cn(
              'flex flex-col md:flex-row justify-between items-start md:items-center gap-6',
              centerHeader && 'md:flex-col md:items-center md:text-center'
            )}>
              <div className="flex items-center gap-4">
                {icon && (
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-frame-deep text-parchment-100 shadow-raised border border-frame/40">
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink-strong tracking-tight">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="fantasy-subtitle mt-1 tracking-wide">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              {action && <div className="animate-in fade-in slide-in-from-right-4">{action}</div>}
            </div>
            {/* Divisore decorato */}
            <div className="divider-ornate mt-6 relative">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ornament-diamond w-1.5 h-1.5" />
            </div>
          </div>
        )}

        <div className="max-w-none">
          {children}
        </div>

        {/* Footer con sigillo */}
        {showDecorations && (
          <div className="mt-12 flex items-center justify-center gap-3 opacity-40 transition-opacity group-hover:opacity-70">
            <div className="h-px w-12 bg-frame/40" />
            <span className="ornament-diamond w-1.5 h-1.5" />
            <span className="block w-2.5 h-2.5 rotate-45 border border-frame/60" />
            <span className="ornament-diamond w-1.5 h-1.5" />
            <div className="h-px w-12 bg-frame/40" />
          </div>
        )}
      </div>
    </div>
  );

  if (!withContainer) return content;

  return (
    <div className={cn('container mx-auto p-4 md:p-8', maxWidthClasses[maxWidth])}>
      {content}
    </div>
  );
}