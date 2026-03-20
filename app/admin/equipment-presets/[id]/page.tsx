// app/admin/equipment-presets/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEquipmentPreset } from '@/hooks/queries/useEquipmentPresets'
import CreateEquipmentPresetPage from '../create/page'

export default function EditEquipmentPresetPage() {
  const params = useParams()
  const id = parseInt(params.id as string)
  const { data: preset, isLoading } = useEquipmentPreset(id)

  if (isLoading) return <div>Caricamento...</div>
  if (!preset) return <div>Preset non trovato</div>

  // Passa i dati al componente di creazione
  return <CreateEquipmentPresetPage initialData={preset} />
}