// components/character/creation-wizard/WizardStep.tsx
'use client';

import React from 'react';
import { WizardNav } from '@/components/shared/WizardNav';

interface WizardStepProps {
  title: string;
  subtitle?: string;
  /** Icona (componente lucide) mostrata nel medaglione sopra il titolo. */
  icon?: React.ComponentType<{ className?: string }>;
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  /** Slot per pulsanti extra tra Indietro e Avanti (es. "Salta"). */
  extraActions?: React.ReactNode;
  /** Wrappa il contenuto in un <form>; il pulsante Avanti diventa type="submit". */
  asForm?: boolean;
  onFormSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export function WizardStep({
  title,
  subtitle,
  icon: Icon,
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
      <header className="flex flex-col items-center text-center">
        {Icon && (
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-frame/40 bg-frame-deep text-parchment-100 shadow-raised">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <h2 className="fantasy-title mb-1 text-2xl">{title}</h2>
        {subtitle && <p className="fantasy-subtitle">{subtitle}</p>}
      </header>
      {children}
      {nav}
    </div>
  );

  if (asForm) {
    return <form onSubmit={onFormSubmit}>{inner}</form>;
  }
  return inner;
}
