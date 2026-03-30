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
  properties: Record<string, unknown>
  created_at: string
}

export type CreateInventoryItemDTO = Omit<Partial<InventoryItem>, 'id' | 'created_at' | 'character_id'> & {
  name?: string   // opzionale: se omesso il server lo legge dal catalogo items
  quantity?: number
  cost?: number    // alias per value, se presente sovrascrive value
}

export type UpdateInventoryItemDTO = Partial<CreateInventoryItemDTO>

export type InventoryListResponse = {
  items: InventoryItem[]
  count: number
}

export default InventoryItem
