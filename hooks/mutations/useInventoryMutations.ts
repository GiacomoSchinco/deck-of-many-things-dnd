import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateInventoryItemDTO, UpdateInventoryItemDTO, InventoryItem } from '@/types/inventory'

export function useCreateInventory(characterId?: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: CreateInventoryItemDTO[]) => {
      if (!characterId) throw new Error('Missing character id')
      const res = await fetch(`/api/characters/${characterId}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore creazione inventory')
      }
      return res.json() as Promise<{ inserted: number; items?: InventoryItem[] }>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', characterId] })
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
