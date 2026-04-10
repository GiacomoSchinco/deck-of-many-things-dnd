import type { CreateItemDTO, UpdateItemDTO, Item } from '@/types/item'
import { createCRUDMutations } from './createCRUDMutations'

const { useCreate, useUpdate, useDelete } = createCRUDMutations<Item, CreateItemDTO, UpdateItemDTO>({
  basePath: '/api/items',
  queryKey: 'items',
  errors: {
    create: 'Errore creazione item',
    update: 'Errore aggiornamento item',
    delete: 'Errore eliminazione item',
  },
})

export const useCreateItem = useCreate
export const useUpdateItem = useUpdate
export const useDeleteItem = useDelete

export function useItemMutations() {
  return {
    create: useCreate(),
    update: useUpdate(),
    delete: useDelete(),
  }
}
