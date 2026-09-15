import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * La scala di profondità dell'app.
 *
 * Regola: nessun contenitore si costruisce bordo + sfondo + ombra a mano.
 * Ogni blocco sceglie un gradino, e tutti i gradini condividono la stessa
 * direzione di luce (dall'alto) e la stessa terna di ombre stratificate
 * (contatto + ambiente + luce di bordo). È la coerenza, non l'effetto,
 * a far sembrare il progetto "non piatto".
 *
 *   0  a filo      · separatori, chip neutri, barre
 *   1  appoggiata  · tessere, righe di elenco, badge grandi
 *   2  pannello    · sezioni, card di contenuto (default)
 *   3  sollevata   · toolbar, header, blocchi in evidenza
 *   4  sospesa     · dialog, menu, drawer, tooltip
 */
const LEVEL_CLASS = {
  0: "surface-flat",
  1: "surface-tile",
  2: "surface",
  3: "surface-raised",
  4: "surface-floating",
} as const

export type SurfaceLevel = keyof typeof LEVEL_CLASS

export interface SurfaceProps extends React.ComponentProps<"div"> {
  /** Gradino di elevazione (default: 2, il pannello) */
  level?: SurfaceLevel
  /** Scavata nel materiale (pozzetto) invece che appoggiata sopra */
  inset?: boolean
  /** Reagisce al puntatore: si solleva al passaggio, si abbassa al click */
  interactive?: boolean
  /** Versione discreta: cambia solo l'ombra — per righe e voci di elenco */
  quiet?: boolean
  /** Riflesso diagonale che attraversa la superficie al passaggio del mouse */
  sheen?: boolean
}

export function Surface({
  level = 2,
  inset = false,
  interactive = false,
  quiet = false,
  sheen = false,
  className,
  ...props
}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      data-level={level}
      className={cn(
        inset ? "surface-well" : LEVEL_CLASS[level],
        interactive && (quiet ? "interactive-quiet" : "interactive"),
        sheen && "sheen",
        className
      )}
      {...props}
    />
  )
}

export interface SurfaceTitleProps extends React.ComponentProps<"h2"> {
  /** Sopra il titolo: categoria del blocco, in maiuscoletto spaziato */
  eyebrow?: string
  /** Riga di separazione ornamentale sotto il titolo */
  divider?: boolean
}

/**
 * Intestazione interna a una superficie. Sostituisce i `fantasy-section-header`
 * scritti a mano nelle singole pagine, così il ritmo tipografico è uno solo.
 */
export function SurfaceTitle({
  eyebrow,
  divider = false,
  className,
  children,
  ...props
}: SurfaceTitleProps) {
  return (
    <div className={cn("mb-4", className)}>
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <h2
        className="fantasy-title text-lg leading-snug mb-0"
        {...props}
      >
        {children}
      </h2>
      {divider && (
        <div className="divider-ornate mt-3 relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 ornament-diamond w-1.5 h-1.5" />
        </div>
      )}
    </div>
  )
}
