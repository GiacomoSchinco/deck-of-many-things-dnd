// hooks/mutations/useEquipmentPresetMutations.ts
import { CreateEquipmentPresetDTO, UpdateEquipmentPresetDTO, EquipmentPreset } from '@/types/equipment'
import { createCRUDMutations } from './createCRUDMutations'

const { useCreate, useUpdate, useDelete } = createCRUDMutations<
  EquipmentPreset,
  CreateEquipmentPresetDTO,
  UpdateEquipmentPresetDTO
>({
  basePath: '/api/equipments/presets',
  queryKey: 'equipment-presets',
  errors: {
    create: 'Errore creazione preset',
    update: 'Errore aggiornamento preset',
    delete: 'Errore eliminazione preset',
  },
})

export const useCreateEquipmentPreset = useCreate
export const useUpdateEquipmentPreset = useUpdate
export const useDeleteEquipmentPreset = useDelete

export function useEquipmentPresetMutations() {
  return {
    create: useCreate(),
    update: useUpdate(),
    delete: useDelete(),
  }
}