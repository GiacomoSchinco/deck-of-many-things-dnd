// app/admin/equipment-presets/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEquipmentPreset } from '@/hooks/queries/useEquipmentPresets'
import Loading from '@/components/custom/Loading'
import { EmptyState } from '@/components/ui/empty-state'
import CreateEquipmentPresetPage from '../create/page'

export default function EditEquipmentPresetPage() {
  const params = useParams()
  const id = parseInt(params.id as string)
  const { data: preset, isLoading } = useEquipmentPreset(id)

  if (isLoading) return <Loading />
  if (!preset) {
    return (
      <EmptyState
        title="Preset non trovato"
        description="Il preset che stai cercando non esiste o è stato eliminato."
      />
    )
  }

  // Passa i dati al componente di creazione
  return <CreateEquipmentPresetPage initialData={preset} />
}