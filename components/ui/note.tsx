import * as React from 'react'
import { Info, TriangleAlert, CircleCheck, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const TONES = {
  /** Informazione neutra: spiegazioni, regole del passo */
  info: { icon: Info, accent: 'text-school-abjuration', rail: 'bg-school-abjuration/60' },
  /** Attenzione: qualcosa che l'utente dovrebbe notare */
  warning: { icon: TriangleAlert, accent: 'text-antique-gold', rail: 'bg-antique-gold/70' },
  /** Errore o conseguenza irreversibile */
  danger: { icon: TriangleAlert, accent: 'text-destructive', rail: 'bg-destructive/70' },
  /** Conferma: operazione riuscita */
  success: { icon: CircleCheck, accent: 'text-success', rail: 'bg-success/70' },
} as const

export interface NoteProps {
  children: React.ReactNode
  tone?: keyof typeof TONES
  /** Sostituisce l'icona predefinita del tono */
  icon?: LucideIcon
  /** Titolo breve sopra il testo */
  title?: string
  className?: string
}

/**
 * Riquadro di nota. Sostituisce i box colorati a mano (`rounded-lg border
 * border-blue-200 bg-blue-50 p-4`) sparsi negli step del wizard: qui c'è un
 * solo modo di dire "nota", con testo e icona che portano il significato
 * invece del solo colore di sfondo.
 */
export function Note({ children, tone = 'info', icon, title, className }: NoteProps) {
  const conf = TONES[tone]
  const Icon = icon ?? conf.icon

  return (
    <div className={cn('surface-well relative flex gap-3 overflow-hidden p-3.5 pr-4', className)} role="note">
      <span className={cn('absolute inset-y-0 left-0 w-1', conf.rail)} aria-hidden="true" />
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', conf.accent)} aria-hidden="true" />
      <div className="min-w-0 text-sm leading-relaxed text-ink">
        {title && <p className="mb-0.5 font-semibold text-ink-strong">{title}</p>}
        {children}
      </div>
    </div>
  )
}
