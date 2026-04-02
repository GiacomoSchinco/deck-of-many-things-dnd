export interface InventoryItem {
  id: string
  character_id: string
  item_id: number | null
  name: string
  type: 'weapon' | 'armor' | 'gear' | 'magic' | 'consumable' | 'ammunition' | 'tool' | null
  quantity: number
  weight: number
  equipped: boolean
  description?: string | null
  notes?: string | null
  value: number
  currency?: string | null
  properties: Record<string, unknown> | null
  created_at: string
}

export type CreateInventoryItemDTO = Omit<Partial<InventoryItem>, 'id' | 'created_at' | 'character_id'> & {
  name?: string   // opzionale: se omesso il server lo legge dal catalogo items
  quantity?: number
  currency?: string | null
}

export type UpdateInventoryItemDTO = Partial<CreateInventoryItemDTO>

export type InventoryListResponse = {
  items: InventoryItem[]
  count: number
}

export default InventoryItem
