'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { RadioGroupItem } from '@/components/ui/radio-group'

/** Guscio condiviso da tutte le scelte dell'app (una sola definizione) */
const CARD_SHELL =
  'surface-tile border-frame/25 p-4 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-soft'

export interface SelectableCardProps extends Omit<React.ComponentProps<'button'>, 'onSelect'> {
  /** Stato di selezione */
  selected?: boolean
  /** Variante compatta, per elenchi lunghi (incantesimi, competenze) */
  size?: 'md' | 'sm'
  /** Segno di spunta nell'angolo quando selezionata */
  showCheck?: boolean
  /** Scelta multipla: espone `role="checkbox"` invece di `aria-pressed` */
  multiple?: boolean
}

/**
 * Riquadro selezionabile — un unico vocabolario per tutte le scelte dell'app
 * (razza, classe, campagne, aumenti di caratteristica, incantesimi, competenze).
 *
 * Prima ogni punto dell'interfaccia inventava il suo: chi `rounded-lg border
 * border-amber-200`, chi `bg-amber-50`, chi cambiava colore al bordo senza
 * toccare la profondità. Il risultato era che la stessa azione (scegliere una
 * cosa) sembrava diversa in ogni schermata.
 *
 * Regole applicate qui una volta sola:
 * - è un `<button>` vero, quindi si attiva con Invio/Spazio e viene letto
 *   dagli screen reader (`aria-pressed`);
 * - focus visibile allineato al resto dell'app;
 * - lo stato disabilitato mantiene il contrasto ma perde ogni reazione al
 *   puntatore (niente hover fantasma);
 * - la selezione si legge da tre segnali insieme — bordo oro, spunta, ombra
 *   più alta — non dal solo colore.
 */
export function SelectableCard({
  selected = false,
  size = 'md',
  showCheck = true,
  multiple = false,
  className,
  children,
  disabled,
  ...props
}: SelectableCardProps) {
  const interactive = !disabled

  return (
    <button
      type="button"
      {...(multiple
        ? { role: 'checkbox' as const, 'aria-checked': selected }
        : { 'aria-pressed': selected })}
      disabled={disabled}
      className={cn(
        'group relative w-full text-left',
        size === 'md' ? 'surface-tile p-4' : 'surface-flat p-3',
        'transition-[transform,box-shadow,border-color,background-color] duration-200 ease-soft',
        selected ? 'border-antique-gold/70 shadow-e2' : 'border-frame/25',
        interactive && !selected && 'hover:-translate-y-0.5 hover:border-frame/40 hover:shadow-e2',
        interactive && 'active:translate-y-0 active:shadow-e1',
        disabled && 'cursor-not-allowed opacity-55',
        'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      {selected && showCheck && (
        <span
          className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-e1"
          aria-hidden="true"
        >
          <Check className="h-3 w-3" />
        </span>
      )}
      {children}
    </button>
  )
}

export interface RadioCardProps {
  value: string
  title: React.ReactNode
  description?: React.ReactNode
  /** Contenuto extra dentro la tessera (es. il pulsante "Tira") */
  children?: React.ReactNode
  disabled?: boolean
  className?: string
}

/**
 * Variante esclusiva di `SelectableCard` per i gruppi radio.
 *
 * Serve perché una scelta esclusiva va fatta con dei veri radio (frecce della
 * tastiera, lettura corretta), non con dei bottoni. Lo stato selezionato si
 * legge dall'attributo `data-checked` che il radio mette su di sé: così la
 * tessera non deve sapere nulla di chi la contiene.
 */
export function RadioCard({
  value,
  title,
  description,
  children,
  disabled,
  className,
}: RadioCardProps) {
  return (
    <label
      className={cn(
        CARD_SHELL,
        'flex cursor-pointer items-start gap-3',
        'hover:-translate-y-0.5 hover:border-frame/40 hover:shadow-e2',
        'has-data-[checked]:border-antique-gold/70 has-data-[checked]:shadow-e2',
        disabled && 'cursor-not-allowed opacity-55 hover:translate-y-0 hover:shadow-e1',
        className
      )}
    >
      <RadioGroupItem value={value} disabled={disabled} className="mt-1" />
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink-strong">{title}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-ink-muted">{description}</span>
        )}
        {children}
      </span>
    </label>
  )
}
