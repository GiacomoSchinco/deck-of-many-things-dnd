import { useQuery } from '@tanstack/react-query'
import type { Item } from '@/types/item'

export type { Item }

interface UseItemsFilters {
  type?: string
  search?: string
}

export function useItems(filters?: UseItemsFilters) {
  const params = new URLSearchParams()

  if (filters?.type) params.set('type', filters.type)
  if (filters?.search) params.set('search', filters.search)

  return useQuery({
    queryKey: ['items', filters],
    queryFn: async (): Promise<Item[]> => {
      const queryString = params.toString()
      const response = await fetch(`/api/items${queryString ? `?${queryString}` : ''}`)
      if (!response.ok) throw new Error('Errore caricamento items')
      return response.json() as Promise<Item[]>
    },
    staleTime: 1000 * 60 * 5,
  })
}
export function useItem(id?: number | null) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: async (): Promise<Item> => {
      if (id === undefined || id === null) throw new Error('No id')
      const response = await fetch(`/api/items/${id}`)
      if (!response.ok) throw new Error('Errore caricamento item')
      return response.json() as Promise<Item>
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}