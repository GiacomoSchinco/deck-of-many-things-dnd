// components/character/creation-wizard/WizardStep.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WizardStepProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  /** Slot for extra buttons between Back and Next (e.g. "Skip"). */
  extraActions?: React.ReactNode;
  /** Wrap children in a <form>; Next button becomes type="submit". */
  asForm?: boolean;
  onFormSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function WizardStep({
  title,
  subtitle,
  onBack,
  backLabel = '← Indietro',
  onNext,
  nextLabel = 'Avanti →',
  nextDisabled = false,
  nextLoading = false,
  extraActions,
  asForm = false,
  onFormSubmit,
  children,
}: WizardStepProps) {
  const nav = (
    <div className={`flex pt-4 ${onBack ? 'justify-between' : 'justify-end'}`}>
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-amber-700 text-amber-700"
        >
          {backLabel}
        </Button>
      )}
      <div className="flex gap-2 items-center">
        {extraActions}
        <Button
          type={asForm ? 'submit' : 'button'}
          onClick={!asForm ? onNext : undefined}
          disabled={nextDisabled || nextLoading}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 disabled:opacity-50"
        >
          {nextLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {nextLabel}
        </Button>
      </div>
    </div>
  );

  const inner = (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">{title}</h2>
        {subtitle && <p className="text-amber-700 text-sm">{subtitle}</p>}
      </div>
      {nav}
      {children}
    </div>
  );

  if (asForm) {
    return <form onSubmit={onFormSubmit}>{inner}</form>;
  }
  return inner;
}
