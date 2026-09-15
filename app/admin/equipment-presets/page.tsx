// app/admin/equipment-presets/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEquipmentPresets } from '@/hooks/queries/useEquipmentPresets'
import { useClasses } from '@/hooks/queries/useClasses'
import DataTable from '@/components/custom/DataTable'
import type { DataTableProps } from '@/components/custom/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Circle, Filter, Package, Calendar, Star, Plus, X } from 'lucide-react'
import Loading from '@/components/custom/Loading'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { getItalianClass } from '@/lib/utils/nameMappers'

export default function EquipmentPresetsPage() {
  const router = useRouter()
  const { data: presets, isLoading, error } = useEquipmentPresets()
  const { data: classes, isLoading: classesLoading } = useClasses()
  const [selectedClass, setSelectedClass] = useState<string>('all')

  if (isLoading || classesLoading) return <Loading />
  if (error) return <div className="text-center text-destructive p-8">Errore: {error.message}</div>

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
    <PageWrapper
      title="Gestione Preset Equipaggiamento"
      subtitle="Crea e modifica i pacchetti di equipaggiamento iniziale per le classi"
      icon={<Package className="w-6 h-6" />}
      maxWidth="xl"
      action={
        <Button onClick={() => router.push('/admin/equipment-presets/create')}>
          <Plus className="w-4 h-4" />
          Nuovo Preset
        </Button>
      }
      contentClassName="space-y-6"
    >
      {/* Filtro per classe */}
      <div className="fantasy-section p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-frame" />
            <span className="fantasy-label font-serif font-medium">Filtra per classe:</span>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="surface-well px-4 py-2 font-medium text-ink outline-none"
          >
            <option value="all">Tutte le classi</option>
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
            >
              <X className="w-4 h-4" />
              Rimuovi filtro
            </Button>
          )}
          <div className="ml-auto text-sm text-ink-muted">
            <span className="font-semibold text-ink-strong">{filteredPresets?.length || 0}</span> preset trovati
          </div>
        </div>
      </div>

          {/* Statistiche rapide */}

          {/* Tabella preset - con stile migliorato */}
          {
            // Costruisce le props come `any` per evitare errori di proprietà in eccesso mentre DataTable supporta customRenderers
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
              
              initialData: tableData,
              visibleColumns: ['name', 'class_name', 'is_default', 'items_count', 'choices_count', 'created_at'],
              labels: {
                name: 'Set',
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
                    ? <Star className="w-4 h-4 text-antique-gold fill-antique-gold" aria-label="Predefinito" />
                    : <Circle className="w-4 h-4 text-ink-muted/40" aria-hidden="true" />
                ),
                items_count: (value: unknown) => (
                  <Badge variant="outline" className="surface-tile text-ink-strong">
                    {value as number}
                  </Badge>
                ),
                choices_count: (value: unknown) => (
                  <Badge variant="outline" className="surface-tile text-ink-strong">
                    {value as number}
                  </Badge>
                ),
                class_name: (value: unknown) => (
                  <span className="font-medium text-ink">{getClassItalian(value as string)}</span>
                ),
                name: (value: unknown) => (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-frame" />
                    <span className="font-medium text-ink-strong">{value as string}</span>
                  </div>
                )
              }
            };

            return <DataTable {...dtProps} />;
          })()}

          {/* Footer decorativo */}
          <div className="text-center text-xs text-ink-muted pt-4 border-t border-frame/20">
            <p className="flex items-center justify-center gap-2">
              <Calendar className="w-3 h-3" />
              I preset predefiniti vengono automaticamente proposti durante la creazione del personaggio
            </p>
          </div>
    </PageWrapper>
  )
}