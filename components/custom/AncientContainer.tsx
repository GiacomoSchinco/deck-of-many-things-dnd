// components/custom/AncientContainer.tsx
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AncientContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  showDecorations?: boolean;
}

export default function AncientContainer({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  footer,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  showDecorations = true,
}: AncientContainerProps) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-xl border-2 border-amber-900/30 shadow-xl overflow-hidden",
      className
    )}>
      {/* Header decorativo */}
      {(title || subtitle || action) && (
        <div className={cn(
          "bg-amber-900/10 border-b border-amber-900/20 px-6 py-5",
          headerClassName
        )}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              {title && (
                <h1 className="text-2xl md:text-3xl fantasy-title flex items-center gap-2">
                  {Icon && <Icon className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />}
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="fantasy-subtitle mt-1">{subtitle}</p>
              )}
            </div>
            {action && (
              <div>{action}</div>
            )}
          </div>
        </div>
      )}

      {/* Contenuto principale */}
      <div className={cn(
        "p-6",
        contentClassName
      )}>
        {children}
      </div>

      {/* Footer decorativo */}
      {footer && (
        <div className={cn(
          "text-center text-xs text-amber-400 pt-4 pb-4 border-t border-amber-200",
          footerClassName
        )}>
          {footer}
        </div>
      )}

      {/* Decorazioni opzionali */}
      {showDecorations && (
        <>
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-900/5 to-transparent rounded-br-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-900/5 to-transparent rounded-tl-full pointer-events-none" />
        </>
      )}
    </div>
  );
}

// Versione semplificata senza header
export function SimpleAncientContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-xl border-2 border-amber-900/30 shadow-xl overflow-hidden",
      className
    )}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// Versione con header personalizzabile
export function AncientContainerWithHeader({
  children,
  header,
  footer,
  className,
  contentClassName,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-xl border-2 border-amber-900/30 shadow-xl overflow-hidden",
      className
    )}>
      {header && (
        <div className="bg-amber-900/10 border-b border-amber-900/20">
          {header}
        </div>
      )}
      <div className={cn("p-6", contentClassName)}>
        {children}
      </div>
      {footer && (
        <div className="text-center text-xs text-amber-400 pt-4 pb-4 border-t border-amber-200">
          {footer}
        </div>
      )}
    </div>
  );
}