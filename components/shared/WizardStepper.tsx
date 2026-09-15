// components/shared/WizardStepper.tsx
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardStepperProps {
  /** Etichette degli step, in ordine. */
  steps: string[];
  /** Indice (0-based) dello step corrente. */
  current: number;
  className?: string;
}

/**
 * Indicatore di avanzamento dei wizard (creazione personaggio e level up).
 *
 * Sostituisce la barra senza etichette: qui si vede sempre a che punto si è,
 * quanti passi mancano e come si chiama il passo corrente. Su mobile diventa
 * una barra compatta per non rubare spazio verticale.
 */
export function WizardStepper({ steps, current, className }: WizardStepperProps) {
  const total = steps.length;
  const safeCurrent = Math.min(Math.max(current, 0), total - 1);
  const percent = total > 1 ? (safeCurrent / (total - 1)) * 100 : 0;

  return (
    <nav aria-label="Avanzamento della creazione" className={cn('w-full', className)}>
      {/* Mobile: barra + passo corrente */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow">
            Passo {safeCurrent + 1} / {total}
          </span>
          <span className="text-sm font-semibold text-ink-strong">{steps[safeCurrent]}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-frame/15">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-soft"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Da sm in su: rail numerato */}
      <div className="hidden sm:block">
        <ol className="flex items-center">
          {steps.map((label, index) => {
            const isDone = index < safeCurrent;
            const isCurrent = index === safeCurrent;

            return (
              <li
                key={label}
                className={cn('flex items-center', index < total - 1 && 'flex-1')}
              >
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  title={label}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300',
                    isDone && 'border-primary/50 bg-primary text-primary-foreground',
                    isCurrent &&
                      'border-primary bg-parchment-50 text-primary ring-2 ring-primary/25',
                    !isDone && !isCurrent && 'border-frame/25 bg-parchment-200/50 text-ink-muted'
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                  <span className="sr-only">{label}</span>
                </span>

                {index < total - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-px flex-1 transition-colors duration-300',
                      index < safeCurrent ? 'bg-primary/50' : 'bg-frame/25'
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-3 text-center text-sm text-ink-muted">
          Passo <strong className="font-semibold text-ink-strong">{safeCurrent + 1}</strong> di{' '}
          {total} · <strong className="font-semibold text-ink-strong">{steps[safeCurrent]}</strong>
        </p>
      </div>
    </nav>
  );
}
