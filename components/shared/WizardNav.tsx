// components/shared/WizardNav.tsx
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { AntiqueButton } from '@/components/custom/AntiqueButton';
import { cn } from '@/lib/utils';

interface WizardNavProps {
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  /** Pulsanti extra tra indietro e avanti (es. "Salta") */
  extraActions?: React.ReactNode;
  /** Se true, il pulsante avanti diventa type="submit" */
  asForm?: boolean;
  className?: string;
}

/**
 * Barra di navigazione condivisa tra tutti i wizard (creation + level-up).
 * Sostituisce il pattern ripetuto in ogni step:
 *   <div className="flex justify-between pt-4 border-t border-amber-200">
 *     <Button variant="outline" ...>Indietro</Button>
 *     <Button ...>Avanti</Button>
 *   </div>
 */
export function WizardNav({
  onBack,
  backLabel = '← Indietro',
  onNext,
  nextLabel = 'Avanti →',
  nextDisabled = false,
  nextLoading = false,
  extraActions,
  asForm = false,
  className,
}: WizardNavProps) {
  return (
    <div className={cn('flex pt-4 border-t border-amber-200', onBack ? 'justify-between' : 'justify-end', className)}>
      {onBack && (
        <AntiqueButton type="button" variant="outline" size="sm" onClick={onBack}>
          {backLabel}
        </AntiqueButton>
      )}
      <div className="flex gap-2 items-center">
        {extraActions}
        <AntiqueButton
          type={asForm ? 'submit' : 'button'}
          size="sm"
          onClick={!asForm ? onNext : undefined}
          disabled={nextDisabled || nextLoading}
          icon={nextLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
        >
          {nextLabel}
        </AntiqueButton>
      </div>
    </div>
  );
}
