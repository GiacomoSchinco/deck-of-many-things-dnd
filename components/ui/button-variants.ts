// components/ui/button-variants.ts
//
// Le varianti del Button vivono qui e non dentro `button.tsx` perché sono dati
// puri (nessun hook, nessuno stato): fuori dal modulo `'use client'` possono
// essere usate anche dai Server Component, evitando di rendere client un'intera
// pagina solo per recuperare le classi di un bottone.
import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border bg-clip-padding text-sm font-medium whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-soft outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Ogni bottone è un oggetto fisico: il gradiente dà la direzione di
           luce, l'ombra stratificata dà l'altezza (e1 a riposo, e2 al
           passaggio), lo stato attivo lo preme dentro la superficie. */
        default:
          "metal-primary border-primary/60 text-primary-foreground shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press",
        outline:
          "surface-tile border-frame/25 text-ink shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press aria-expanded:shadow-e2",
        secondary:
          "metal-parchment border-frame/30 text-secondary-foreground shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press aria-expanded:shadow-e2",
        ghost:
          "border-transparent text-ink hover:bg-parchment-200/70 hover:text-ink-strong active:bg-parchment-300/70 aria-expanded:bg-parchment-200/70",
        destructive:
          "metal-danger border-destructive/60 text-destructive-foreground shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
