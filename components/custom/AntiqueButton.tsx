// components/ui/custom/AntiqueButton.tsx
'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Classi base per tutti i button
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group',
  {
    variants: {
      variant: {
        // 🟫 Classici
        default: 'bg-amber-800 text-amber-50 hover:bg-amber-900 focus:ring-amber-800 border border-amber-700',
        primary: 'bg-antique-gold text-stone-900 hover:bg-amber-600 focus:ring-antique-gold border border-amber-700',
        secondary: 'bg-parchment-300 text-amber-900 hover:bg-parchment-400 focus:ring-parchment-500 border border-amber-700',
        
        // 🎭 Fantasy
        leather: 'bg-amber-900 text-amber-100 hover:bg-amber-950 focus:ring-amber-900 border-2 border-amber-700 shadow-inner',
        ancient: 'bg-transparent text-amber-900 hover:bg-amber-900/10 focus:ring-amber-900 border-2 border-amber-900/30',
        parchment: 'bg-parchment-200 text-amber-900 hover:bg-parchment-300 focus:ring-parchment-600 border border-amber-800/50 shadow-md',
        
        // ⚔️ Pericolo/Speciali
        danger: 'bg-red-800 text-red-50 hover:bg-red-900 focus:ring-red-800 border border-red-700',
        magic: 'bg-purple-800 text-purple-50 hover:bg-purple-900 focus:ring-purple-800 border border-purple-700',
        heal: 'bg-green-700 text-green-50 hover:bg-green-800 focus:ring-green-700 border border-green-600',
        
        // ✨ Outline
        outline: 'border-2 border-amber-800 text-amber-900 hover:bg-amber-800/10 focus:ring-amber-800',
        ghost: 'text-amber-900 hover:bg-amber-900/10 focus:ring-amber-900',
      },
      size: {
        xs: 'px-2 py-1 text-xs gap-1',
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2',
        xl: 'px-8 py-4 text-xl gap-3',
        
        // Dimensioni fantasy (più spaziose)
        'fantasy-sm': 'px-4 py-2 text-sm gap-2',
        'fantasy-md': 'px-6 py-3 text-base gap-3',
        'fantasy-lg': 'px-8 py-4 text-lg gap-4',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
      iconPosition: {
        left: 'flex-row',
        right: 'flex-row-reverse',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'md',
      iconPosition: 'left',
    },
  }
);

export interface AntiqueButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  loading?: boolean;
  shine?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const AntiqueButton = forwardRef<HTMLButtonElement, AntiqueButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    iconPosition,
    icon, 
    loading, 
    shine = false,
    children, 
    disabled,
    href,
    target,
    rel,
    ...props 
  }, ref) => {
    const sharedClass = cn(
      buttonVariants({ variant, size, rounded, iconPosition, className }),
      shine && 'shine-effect',
      loading && 'cursor-wait'
    );

    const content = (
      <>
        {/* Effetto shine (opzionale) */}
        {shine && (
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        
        {/* Loader (opzionale) */}
        {loading && (
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        
        {/* Icona */}
        {icon && !loading && (
          <span className={cn(
            'inline-flex',
            size === 'xs' && 'text-sm',
            size === 'sm' && 'text-base',
            size === 'md' && 'text-lg',
            size === 'lg' && 'text-xl',
            size === 'xl' && 'text-2xl',
          )}>
            {icon}
          </span>
        )}
        
        {/* Testo */}
        <span>{children}</span>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={sharedClass}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        className={sharedClass}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

AntiqueButton.displayName = 'AntiqueButton';