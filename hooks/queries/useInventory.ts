import { useQuery } from '@tanstack/react-query'
import type { InventoryItem, InventoryListResponse } from '@/types/inventory'

export function useInventory(characterId?: string | null, params?: { search?: string; equipped?: boolean; item_type?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['inventory', characterId, params],
    queryFn: async (): Promise<InventoryListResponse> => {
      if (!characterId) throw new Error('No character id')
      const qs = new URLSearchParams()
      if (params?.search) qs.set('search', params.search)
      if (typeof params?.equipped === 'boolean') qs.set('equipped', String(params.equipped))
      if (params?.item_type) qs.set('item_type', params.item_type)
      if (params?.page) qs.set('page', String(params.page))
      if (params?.pageSize) qs.set('pageSize', String(params.pageSize))

      const url = `/api/characters/${characterId}/inventory${qs.toString() ? `?${qs.toString()}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Errore caricamento inventory')
      return res.json() as Promise<InventoryListResponse>
    },
    enabled: !!characterId,
    staleTime: 1000 * 60 * 1,
  })
}

export function useInventoryItem(characterId?: string | null, invId?: string | null) {
  return useQuery({
    queryKey: ['inventory-item', characterId, invId],
    queryFn: async (): Promise<InventoryItem> => {
      if (!characterId || !invId) throw new Error('Missing ids')
      const res = await fetch(`/api/characters/${characterId}/inventory/${invId}`)
      if (!res.ok) throw new Error('Errore caricamento inventory item')
      return res.json() as Promise<InventoryItem>
    },
    enabled: !!characterId && !!invId,
    staleTime: 1000 * 60 * 1,
  })
}
