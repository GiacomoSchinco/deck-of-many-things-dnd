// app/admin/equipment-presets/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEquipmentPresets } from '@/hooks/queries/useEquipmentPresets'
import DataTable from '@/components/custom/DataTable'
import AncientCardContainer from '@/components/custom/AncientCardContainer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Loading from '@/components/custom/Loading'

export default function EquipmentPresetsPage() {
  const router = useRouter()
  const { data: presets, isLoading, error } = useEquipmentPresets()
  const [selectedClass, setSelectedClass] = useState<string>('all')

  if (isLoading) return <Loading />
  if (error) return <div>Errore: {error.message}</div>

  // Filtra per classe se selezionata
  const filteredPresets = selectedClass === 'all' 
    ? presets 
    : presets?.filter(p => p.class_id === parseInt(selectedClass))

  // Prepara dati per la tabella
  const tableData = filteredPresets?.map(p => ({
    id: p.id,
    name: p.name,
    class_name: p.class_name || 'N/A',
    is_default: p.is_default ? '✓' : '✗',
    items_count: p.items.length,
    choices_count: p.choices?.length || 0,
    created_at: p.created_at ? new Date(p.created_at).toLocaleDateString('it-IT') : '-'
  })) || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-amber-900">
            📦 Gestione Preset Equipaggiamento
          </h1>
          <p className="text-amber-700 mt-1">
            Crea e modifica i pacchetti di equipaggiamento iniziale per le classi
          </p>
        </div>

        <Button 
          onClick={() => router.push('/admin/equipment-presets/create')}
          className="bg-amber-700 hover:bg-amber-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Preset
        </Button>
      </div>

      {/* Filtro per classe */}
      <AncientCardContainer className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-amber-800 font-serif">Filtra per classe:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-parchment-100 border-2 border-amber-700 rounded text-amber-900"
          >
            <option value="all">Tutte le classi</option>
            {/* Qui andrebbero le classi dinamicamente */}
            <option value="1">Barbarian</option>
            <option value="2">Bard</option>
            <option value="3">Cleric</option>
            {/* ... altre classi */}
          </select>
        </div>
      </AncientCardContainer>

      {/* Tabella preset */}
      <DataTable
        title="Preset di equipaggiamento"
        initialData={tableData}
        visibleColumns={['name', 'class_name', 'is_default', 'items_count', 'choices_count', 'created_at']}
        labels={{
          name: 'Nome',
          class_name: 'Classe',
          is_default: 'Default',
          items_count: 'Oggetti fissi',
          choices_count: 'Scelte',
          created_at: 'Creazione'
        }}
        onRowClick={(id) => router.push(`/admin/equipment-presets/${id}`)}
        pagination={true}
      />
    </div>
  )
}