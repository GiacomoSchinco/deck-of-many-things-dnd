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
      wrapper: 'bg-[#f4ecd8] text-[#3e2723]',
      border: 'border-[#b89b72]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.3),_inset_0_0_60px_rgba(139,69,19,0.15)]',
    },
    scroll: {
      wrapper: 'bg-gradient-to-b from-[#f4ecd8] via-[#ede0c1] to-[#f4ecd8]',
      border: 'border-x-4 border-[#8b4513]/40',
      shadow: 'shadow-2xl',
    },
    minimal: {
      wrapper: 'bg-[#fdfbf7]',
      border: 'border border-[#d2b48c]/30',
      shadow: 'shadow-sm',
    },
  };

  const style = variantStyles[variant];

  const content = (
    <div className={cn(
      'relative overflow-hidden rounded-sm transition-all duration-500 w-full', 
      variant !== 'minimal' && 'before:absolute before:inset-0 before:bg-[url("https://www.transparenttextures.com/patterns/p6.png")] before:opacity-30 before:pointer-events-none',
      style.border, 
      style.shadow, 
      style.wrapper, 
      className
    )}>
      
      {/* Overlay Vignetta per effetto carta invecchiata */}
      {variant !== 'minimal' && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_60%,rgba(62,39,35,0.05)_100%)]" />
      )}

      {/* Decorazioni angolari "Filigrana Oro" */}
      {showDecorations && variant === 'default' && (
        <>
          <div className="absolute top-0 left-0 w-24 h-24 bg-[url('https://www.transparenttextures.com/patterns/vintage-specials.png')] opacity-20 rotate-0 pointer-events-none" />
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600/40 rounded-tl-sm" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600/40 rounded-tr-sm" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600/40 rounded-bl-sm" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600/40 rounded-br-sm" />
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
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3e2723] text-[#f4ecd8] shadow-lg border border-amber-600/30">
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3e2723] tracking-tight">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-amber-800/70 text-sm md:text-base mt-1 font-serif italic tracking-wide">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              {action && <div className="animate-in fade-in slide-in-from-right-4">{action}</div>}
            </div>
            {/* Divisore decorato */}
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-amber-800/40 to-transparent relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 text-[10px] opacity-40">✧</div>
            </div>
          </div>
        )}

        <div className="prose prose-stone max-w-none">
          {children}
        </div>

        {/* Footer con sigillo */}
        {showDecorations && (
          <div className="mt-12 flex items-center justify-center gap-4 opacity-30 group-hover:opacity-60 transition-opacity">
             <div className="h-px w-12 bg-amber-900/40" />
             <span className="text-xs">⚔️</span>
             <div className="h-px w-12 bg-amber-900/40" />
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