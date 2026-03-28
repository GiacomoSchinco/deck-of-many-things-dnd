// hooks/queries/useSpellcastingProgression.ts
import { useQuery } from '@tanstack/react-query'

export type SpellcastingProgression = {
  id: number
  class_name: string
  level: number
  cantrips_known: number | null
  spells_known: number | null
  spell_slots: Record<string, number> | null
  pact_slots: number | null
  pact_slot_level: string | null
}

/** Progressione incantesimi per una classe a un livello specifico */
export function useSpellcastingProgression(className: string | null, level: number = 1) {
  return useQuery({
    queryKey: ['spellcasting-progression', className, level],
    queryFn: async (): Promise<SpellcastingProgression | null> => {
      const params = new URLSearchParams({
        class: className!,
        level: String(level),
      })
      const res = await fetch(`/api/spellcasting-progression?${params}`)
      if (!res.ok) throw new Error('Errore caricamento progressione incantesimi')
      return res.json()
    },
    enabled: !!className,
    staleTime: 1000 * 60 * 60, // 1 ora (dati statici)
  })
}

/** Intera progressione di una classe (tutti i livelli) */
export function useClassSpellcastingProgression(className: string | null) {
  return useQuery({
    queryKey: ['spellcasting-progression', className],
    queryFn: async (): Promise<SpellcastingProgression[]> => {
      const params = new URLSearchParams({ class: className! })
      const res = await fetch(`/api/spellcasting-progression?${params}`)
      if (!res.ok) throw new Error('Errore caricamento progressione incantesimi')
      return res.json()
    },
    enabled: !!className,
    staleTime: 1000 * 60 * 60,
  })
}
