import type { CreateSpellDTO, UpdateSpellDTO, Spell } from '@/types/spell'
import { createCRUDMutations } from './createCRUDMutations'

const { useCreate, useUpdate, useDelete } = createCRUDMutations<Spell, CreateSpellDTO, UpdateSpellDTO>({
  basePath: '/api/spells',
  queryKey: 'spells',
  errors: {
    create: 'Errore creazione incantesimo',
    update: 'Errore aggiornamento incantesimo',
    delete: 'Errore eliminazione incantesimo',
  },
})

export const useCreateSpell = useCreate
export const useUpdateSpell = useUpdate
export const useDeleteSpell = useDelete

export function useSpellMutations() {
  return {
    create: useCreate(),
    update: useUpdate(),
    delete: useDelete(),
  }
}
