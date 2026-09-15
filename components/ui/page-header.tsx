import * as React from "react"

import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  /** Occhiello: la categoria della pagina, sopra il titolo */
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  /** Elemento icona (es. un componente lucide già dimensionato) */
  icon?: React.ReactNode
  /** Azioni allineate a destra (bottoni, link) */
  actions?: React.ReactNode
  /** Titolo in oro battuto — riservato alle pagine "vetrina" */
  foil?: boolean
  align?: "start" | "center"
  className?: string
}

/**
 * Unico meccanismo per il titolo di una pagina: prima ne esistevano tre
 * (PageWrapper, AncientContainer, h1 scritti a mano) con margini che si
 * sommavano. Qui il ritmo è definito una volta sola.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  actions,
  foil = false,
  align = "start",
  className,
}: PageHeaderProps) {
  const centered = align === "center"

  return (
    <header className={cn("mb-8 group", className)}>
      <div
        className={cn(
          "flex gap-5",
          centered
            ? "flex-col items-center text-center"
            : "flex-col md:flex-row md:items-center md:justify-between"
        )}
      >
        <div className={cn("flex items-center gap-4", centered && "flex-col")}>
          {icon && (
            <div
              className={cn(
                "shrink-0 grid place-items-center w-14 h-14 rounded-full",
                "surface-raised border border-frame/40 text-frame-deep"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
            <h1
              className={cn(
                "text-3xl md:text-4xl font-serif font-bold tracking-tight mb-0 leading-[1.1]",
                foil ? "text-foil" : "text-ink-strong"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="fantasy-subtitle mt-2 max-w-prose">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      <div className="divider-ornate mt-6 relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 ornament-diamond w-1.5 h-1.5" />
        {centered && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 ornament-diamond w-1.5 h-1.5" />
        )}
      </div>
    </header>
  )
}
