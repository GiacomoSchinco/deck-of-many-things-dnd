// hooks/queries/useEquipmentPresets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EquipmentPreset, CreateEquipmentPresetDTO, UpdateEquipmentPresetDTO } from '@/types/equipment'

// GET lista preset
export function useEquipmentPresets(classId?: number) {
  const params = new URLSearchParams()
  if (classId) params.set('class_id', String(classId))

  return useQuery({
    queryKey: ['equipment-presets', classId],
    queryFn: async () => {
      const res = await fetch(`/api/equipment-presets?${params}`)
      if (!res.ok) throw new Error('Errore caricamento preset')
      const data = await res.json()
      return data.presets as EquipmentPreset[]
    }
  })
}

// GET singolo preset
export function useEquipmentPreset(id: number | null) {
  return useQuery({
    queryKey: ['equipment-preset', id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`/api/equipment-presets/${id}`)
      if (!res.ok) throw new Error('Errore caricamento preset')
      return res.json() as Promise<EquipmentPreset>
    },
    enabled: !!id
  })
}