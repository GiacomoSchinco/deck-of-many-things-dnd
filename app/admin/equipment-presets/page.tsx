// app/admin/equipment-presets/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEquipmentPresets } from '@/hooks/queries/useEquipmentPresets'
import { useClasses } from '@/hooks/queries/useClasses'
import DataTable from '@/components/custom/DataTable'
import type { DataTableProps } from '@/components/custom/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Filter, Package, Calendar, Star } from 'lucide-react'
import Loading from '@/components/custom/Loading'
import { getItalianClass } from '@/lib/utils/nameMappers'

export default function EquipmentPresetsPage() {
  const router = useRouter()
  const { data: presets, isLoading, error } = useEquipmentPresets()
  const { data: classes, isLoading: classesLoading } = useClasses()
  const [selectedClass, setSelectedClass] = useState<string>('all')

  if (isLoading || classesLoading) return <Loading />
  if (error) return <div className="text-center text-red-500 p-8">Errore: {error.message}</div>

  // Filtra per classe se selezionata
  const filteredPresets = selectedClass === 'all' 
    ? presets 
    : presets?.filter(p => p.class_id === parseInt(selectedClass))

  // Prepara dati per la tabella
  const tableData = filteredPresets?.map(p => ({
    id: p.id,
    name: p.name,
    class_name: p.class_name || 'N/A',
    is_default: p.is_default,
    items_count: p.items.length,
    choices_count: p.choices?.length || 0,
    created_at: p.created_at ? new Date(p.created_at).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) : '-'
  })) || []

  const getClassItalian = (className: string) => {
    if (className === 'N/A') return 'N/A'
    return getItalianClass(className)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="bg-gradient-to-br from-parchment-100 to-parchment-200 rounded-xl border-2 border-amber-900/30 shadow-xl overflow-hidden">
        {/* Header decorativo */}
        <div className="bg-amber-900/10 border-b border-amber-900/20 px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-900 flex items-center gap-2">
                <Package className="w-7 h-7 text-amber-700" />
                Gestione Preset Equipaggiamento
              </h1>
              <p className="text-amber-600 text-sm mt-1">
                Crea e modifica i pacchetti di equipaggiamento iniziale per le classi
              </p>
            </div>
            <Button 
              onClick={() => router.push('/admin/equipment-presets/create')}
              className="bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Preset
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Filtro per classe - migliorato */}
          <div className="bg-amber-50/50 rounded-lg border border-amber-200 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 font-serif font-medium">Filtra per classe:</span>
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-amber-300 rounded-lg text-amber-900 font-medium focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="all">📋 Tutte le classi</option>
                {classes?.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {getItalianClass(cls.name)}
                  </option>
                ))}
              </select>
              {selectedClass !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClass('all')}
                  className="text-amber-600 hover:text-amber-800"
                >
                  ✖️ Rimuovi filtro
                </Button>
              )}
              <div className="ml-auto text-sm text-amber-500">
                <span className="font-semibold text-amber-700">{filteredPresets?.length || 0}</span> preset trovati
              </div>
            </div>
          </div>

          {/* Statistiche rapide */}

          {/* Tabella preset - con stile migliorato */}
          {
            // Build props as `any` to avoid excess-property issues while DataTable supports customRenderers
          }
          {(() => {
            type Row = {
              id: number;
              name: string;
              class_name: string;
              is_default: boolean;
              items_count: number;
              choices_count: number;
              created_at: string;
            };

            const dtProps: DataTableProps<Row> = {
              title: "Preset di equipaggiamento",
              initialData: tableData,
              visibleColumns: ['name', 'class_name', 'is_default', 'items_count', 'choices_count', 'created_at'],
              labels: {
                name: 'Nome Preset',
                class_name: 'Classe',
                is_default: 'Default',
                items_count: 'Oggetti',
                choices_count: 'Scelte',
                created_at: 'Creazione'
              },
              onRowClick: (id: unknown) => router.push(`/admin/equipment-presets/${id}`),
              pagination: true,
              customRenderers: {
                is_default: (value: unknown) => (
                  (value as boolean)
                    ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-label="Predefinito" />
                    : <span className="text-amber-300">○</span>
                ),
                items_count: (value: unknown) => (
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                    {value as number}
                  </Badge>
                ),
                choices_count: (value: unknown) => (
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                    {value as number}
                  </Badge>
                ),
                class_name: (value: unknown) => (
                  <span className="font-medium text-amber-800">{getClassItalian(value as string)}</span>
                ),
                name: (value: unknown) => (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-amber-900">{value as string}</span>
                  </div>
                )
              }
            };

            return <DataTable {...dtProps} />;
          })()}

          {/* Footer decorativo */}
          <div className="text-center text-xs text-amber-400 pt-4 border-t border-amber-200">
            <p className="flex items-center justify-center gap-2">
              <Calendar className="w-3 h-3" />
              I preset predefiniti vengono automaticamente proposti durante la creazione del personaggio
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}