// components/character/creation-wizard/WizardStep.tsx
'use client';

import React from 'react';
import { WizardNav } from '@/components/shared/WizardNav';

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
    <WizardNav
      onBack={onBack}
      backLabel={backLabel}
      onNext={onNext}
      nextLabel={nextLabel}
      nextDisabled={nextDisabled}
      nextLoading={nextLoading}
      extraActions={extraActions}
      asForm={asForm}
    />
  );

  const inner = (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl fantasy-title mb-2">{title}</h2>
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
