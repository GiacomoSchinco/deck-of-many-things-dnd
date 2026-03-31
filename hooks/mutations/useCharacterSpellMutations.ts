import { useMutation, useQueryClient } from '@tanstack/react-query'

type AddPayload = { characterId: string; spellIds: number[]; prepared?: boolean }
type RemovePayload = { characterId: string; knownIds?: string[]; spellIds?: number[] }

export function useAddCharacterSpells() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AddPayload) => {
      const { characterId, spellIds, prepared = false } = payload
      const res = await fetch(`/api/characters/${characterId}/spells`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spell_ids: spellIds, prepared }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Errore salvataggio incantesimi')
      }
      return res.json()
    },
    onSuccess: (_data, variables: AddPayload) => {
      queryClient.invalidateQueries({ queryKey: ['character', variables.characterId, 'spells'] })
      queryClient.invalidateQueries({ queryKey: ['character', variables.characterId] })
    }
  })
}

export function useRemoveCharacterSpells() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: RemovePayload) => {
      const { characterId, knownIds, spellIds } = payload
      const res = await fetch(`/api/characters/${characterId}/spells`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ known_ids: knownIds || [], spell_ids: spellIds || [] }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Errore eliminazione incantesimi')
      }
      return res.json()
    },
    onSuccess: (_data, variables: RemovePayload) => {
      queryClient.invalidateQueries({ queryKey: ['character', variables.characterId, 'spells'] })
      queryClient.invalidateQueries({ queryKey: ['character', variables.characterId] })
    }
  })
}

type InitSpellSlotsPayload = {
  characterId: string
  slots: { spell_level: number; total_slots: number; used_slots: number }[]
}

export function useInitSpellSlots() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ characterId, slots }: InitSpellSlotsPayload) => {
      const res = await fetch(`/api/characters/${characterId}/spell-slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Errore inizializzazione spell slots')
      }
      return res.json()
    },
    onSuccess: (_data, { characterId }) => {
      queryClient.invalidateQueries({ queryKey: ['character', characterId, 'spell-slots'] })
    },
  })
}

export function useCharacterSpellMutations() {
  return {
    add: useAddCharacterSpells(),
    remove: useRemoveCharacterSpells(),
    initSlots: useInitSpellSlots(),
  }
}
