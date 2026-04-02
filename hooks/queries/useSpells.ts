// hooks/queries/useSpells.ts
import { useQuery } from '@tanstack/react-query';
import type { PreparedSpell } from '@/types/spell';

export function useSpells(filters?: { class?: string; level?: string | number; school?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.level !== undefined && filters.level !== '') params.set('level', String(filters.level))
  if (filters?.school) params.set('school', filters.school)
  if (filters?.search) params.set('search', filters.search)
  
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

export function useSpell(id: number | null) {
  return useQuery({
    queryKey: ['spell', id],
    queryFn: async () => {
      const res = await fetch(`/api/spells/${id}`)
      if (!res.ok) throw new Error('Errore caricamento incantesimo')
      return res.json()
    },
    enabled: id !== null,
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

export function useCharacterSpellSlots(characterId: string | null) {
  return useQuery({
    queryKey: ['character', characterId, 'spell-slots'],
    queryFn: async () => {
      const res = await fetch(`/api/characters/${characterId}/spell-slots`)
      if (!res.ok) throw new Error('Errore caricamento slot incantesimi')
      return res.json()
    },
    enabled: !!characterId,
  })
}

export function useCharacterPreparedSpells(characterId: string | null) {
  return useQuery({
    queryKey: ['character', characterId, 'prepared-spells'],
    queryFn: async () => {
      const res = await fetch(`/api/characters/${characterId}/prepared-spells`)
      if (!res.ok) throw new Error('Errore caricamento incantesimi preparati')
      return res.json() as Promise<PreparedSpell[]>
    },
    enabled: !!characterId,
  })
}