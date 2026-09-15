import * as React from "react"
import { ScrollText, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Surface } from "@/components/ui/surface"

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  /** Invito all'azione: di solito un link o un bottone */
  action?: React.ReactNode
  className?: string
}

/**
 * Stato vuoto. Prima erano emoji grandi su testo centrato (📜) — fuori dal
 * linguaggio del progetto e invisibili agli screen reader con il giusto peso.
 * Qui: pozzetto incassato, medaglione icona, gerarchia occhiello/titolo/testo.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = ScrollText,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Surface
      level={1}
      inset
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center border-dashed",
        className
      )}
    >
      <span
        className="grid place-items-center w-14 h-14 rounded-full surface-raised text-frame-deep"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6" />
      </span>

      <div>
        <p className="fantasy-title text-lg">{title}</p>
        {description && (
          <p className="fantasy-subtitle mt-1 max-w-sm mx-auto">{description}</p>
        )}
      </div>

      {action && <div className="mt-1">{action}</div>}
    </Surface>
  )
}
