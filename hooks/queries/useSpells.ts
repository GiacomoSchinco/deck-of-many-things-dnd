// hooks/queries/useSpells.ts
import { useQuery } from '@tanstack/react-query';

export function useSpells(filters?: { class?: string; level?: number }) {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.level) params.set('level', String(filters.level))
  
  return useQuery({
    queryKey: ['spells', filters],
    queryFn: async () => {
      const res = await fetch(`/api/spells?${params}`)
      if (!res.ok) throw new Error('Errore caricamento incantesimi')
      return res.json()
    },
    staleTime: 1000 * 60 * 60, // 1 ora
  })
}

export function useCharacterSpells(characterId: string | null) {
  return useQuery({
    queryKey: ['character', characterId, 'spells'],
    queryFn: async () => {
      const res = await fetch(`/api/characters/${characterId}/spells`)
      if (!res.ok) throw new Error('Errore caricamento incantesimi')
      return res.json()
    },
    enabled: !!characterId,
  })
}