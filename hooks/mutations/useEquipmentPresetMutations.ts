// hooks/mutations/useEquipmentPresetMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateEquipmentPresetDTO, UpdateEquipmentPresetDTO, EquipmentPreset } from '@/types/equipment'

export function useCreateEquipmentPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateEquipmentPresetDTO) => {
      const res = await fetch('/api/equipments/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Errore creazione preset')
      }
      return res.json() as Promise<EquipmentPreset>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-presets'] })
    }
  })
}

export function useUpdateEquipmentPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateEquipmentPresetDTO & { id: number }) => {
      const res = await fetch(`/api/equipments/presets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Errore aggiornamento preset')
      }
      return res.json() as Promise<EquipmentPreset>
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['equipment-presets'] })
      queryClient.invalidateQueries({ queryKey: ['equipment-preset', variables.id] })
    }
  })
}

export function useDeleteEquipmentPreset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/equipments/presets/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Errore eliminazione preset')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-presets'] })
    }
  })
}

// Hook unico con tutte le mutation (opzionale)
export function useEquipmentPresetMutations() {
  return {
    create: useCreateEquipmentPreset(),
    update: useUpdateEquipmentPreset(),
    delete: useDeleteEquipmentPreset()
  }
}