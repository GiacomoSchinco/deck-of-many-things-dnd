import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateInventoryItemDTO, UpdateInventoryItemDTO, InventoryItem } from '@/types/inventory'

export function useCreateInventory(characterId?: string | null) {
  const queryClient = useQueryClient()

  type Payload = CreateInventoryItemDTO[] | { characterId?: string | null; items: CreateInventoryItemDTO[] };

  return useMutation<{ inserted: number; items?: InventoryItem[] }, unknown, Payload>({
    mutationFn: async (payload: Payload) => {
      let cid: string | null | undefined = characterId
      let itemsToSend: CreateInventoryItemDTO[]

      if (Array.isArray(payload)) {
        itemsToSend = payload
      } else {
        itemsToSend = payload.items
        if (payload.characterId !== undefined) cid = payload.characterId
      }

      if (!cid) throw new Error('Missing character id')

      const res = await fetch(`/api/characters/${cid}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSend })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore creazione inventory')
      }
      return res.json() as Promise<{ inserted: number; items?: InventoryItem[] }>
    },
    onSuccess: (_, variables) => {
      // variables may be array (unknown characterId) or object with characterId
      let cid: string | null | undefined = characterId
      if (!Array.isArray(variables) && variables && 'characterId' in variables) {
        cid = variables.characterId
      }
      queryClient.invalidateQueries({ queryKey: ['inventory', cid] })
    }
  })
}

export function useUpdateInventory(characterId?: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInventoryItemDTO }) => {
      if (!characterId) throw new Error('Missing character id')
      const res = await fetch(`/api/characters/${characterId}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore aggiornamento inventory')
      }
      return res.json() as Promise<InventoryItem>
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', characterId] })
      queryClient.invalidateQueries({ queryKey: ['inventory-item', characterId, variables.id] })
    }
  })
}

export function useDeleteInventory(characterId?: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      if (!characterId) throw new Error('Missing character id')
      const res = await fetch(`/api/characters/${characterId}/inventory/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore eliminazione inventory')
      }
      return res.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['inventory', characterId] })
      queryClient.invalidateQueries({ queryKey: ['inventory-item', characterId, id] })
    }
  })
}

export function useInventoryMutations(characterId?: string | null) {
  return {
    create: useCreateInventory(characterId),
    update: useUpdateInventory(characterId),
    delete: useDeleteInventory(characterId),
  }
}
