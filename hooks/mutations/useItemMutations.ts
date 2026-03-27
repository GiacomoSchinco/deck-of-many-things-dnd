import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateItemDTO, UpdateItemDTO, Item } from '@/types/item'

export function useCreateItem() {
  const queryClient = useQueryClient()
  return useMutation<Item, unknown, CreateItemDTO>({
    mutationFn: async (data: CreateItemDTO) => {
      const res = await fetch(`/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore creazione item')
      }
      return res.json() as Promise<Item>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    }
  })
}

export function useUpdateItem() {
  const queryClient = useQueryClient()
  return useMutation<Item, unknown, { id: number; data: UpdateItemDTO }>({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore aggiornamento item')
      }
      return res.json() as Promise<Item>
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] })
    }
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation<void, unknown, number>({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Errore eliminazione item')
      }
      return res.json()
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['item', id] })
    }
  })
}

export function useItemMutations() {
  return {
    create: useCreateItem(),
    update: useUpdateItem(),
    delete: useDeleteItem(),
  }
}
