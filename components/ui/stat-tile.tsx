import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Surface } from "@/components/ui/surface"

const TONE_CLASS = {
  neutral: "text-frame-deep",
  gold: "text-antique-gold",
  success: "text-success",
  danger: "text-destructive",
} as const

export interface StatTileProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Cosa rappresenta il numero ("Punti ferita", "Livello", ...) */
  label: string
  value: React.ReactNode
  /** Valore secondario mostrato in piccolo accanto (es. "/ 42") */
  suffix?: React.ReactNode
  icon?: LucideIcon
  hint?: string
  tone?: keyof typeof TONE_CLASS
  /** Rende la tessera cliccabile: si solleva al passaggio del mouse */
  interactive?: boolean
}

/**
 * Tessera numerica. Il numero è il protagonista: cifre tabulari, corpo grande,
 * medaglione icona incassato a sinistra. Sostituisce i riquadri `bg-amber-50`
 * con testo centrato sparsi nelle dashboard.
 */
export function StatTile({
  label,
  value,
  suffix,
  icon: Icon,
  hint,
  tone = "neutral",
  interactive = false,
  className,
  ...props
}: StatTileProps) {
  return (
    <Surface
      level={1}
      interactive={interactive}
      className={cn("flex items-center gap-3 p-3.5", className)}
      {...props}
    >
      {Icon && (
        <span
          className={cn(
            "shrink-0 grid place-items-center w-10 h-10 rounded-full",
            "surface-well",
            TONE_CLASS[tone]
          )}
          aria-hidden="true"
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>
      )}

      <div className="min-w-0">
        <p className="eyebrow truncate">{label}</p>
        <p className="flex items-baseline gap-1">
          <span className="stat-value text-2xl leading-none">{value}</span>
          {suffix && (
            <span className="text-sm text-ink-muted font-serif">{suffix}</span>
          )}
        </p>
        {hint && <p className="text-xs text-ink-muted mt-0.5 truncate">{hint}</p>}
      </div>
    </Surface>
  )
}
