// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * `tailwind-merge` conosce solo le utility di Tailwind, non le classi del
 * progetto. Senza questa estensione, `metal-primary` / `surface-tile` (che
 * impostano un `background-image`) restano nel risultato anche quando il
 * chiamante passa un `bg-*`: il gradiente copre il colore di sfondo e il testo
 * finisce scuro su scuro. Dichiarendo quelle classi nel gruppo dello sfondo,
 * un `bg-*` esplicito le sostituisce davvero.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'bg-color': [
        'metal-primary',
        'metal-danger',
        'metal-gold',
        'metal-parchment',
        'surface',
        'surface-flat',
        'surface-tile',
        'surface-raised',
        'surface-floating',
        'surface-well',
        'surface-leather',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

export function filterByName<T extends { name: string }>(items: T[], query: string): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(q));
}