// app/test/spells-table/page.tsx
'use client';

import { useSpells } from '@/hooks/queries/useSpells';
import DataTable from '@/components/custom/DataTable';
import Loading from '@/components/custom/Loading';
import { getItalianClasses, getItalianSchool } from '@/lib/utils/nameMappers';
import { AncientPageWrapper, ScrollPageWrapper } from '@/components/layout/AncientPageWrapper';
import { PageWrapper } from '@/components/layout/PageWrapper';

type SpellRow = {
  id: number;
  name: string;
  level: number;
  school: string;
  casting_time?: string | null;
  range?: string | null;
  duration?: string | null;
  components?: string[] | null;
  ritual?: boolean;
  concentration?: boolean;
  classes?: string[] | null;
  description?: string | null;
  at_higher_levels?: string | null;
};

export default function SpellsTablePage() {
  const { data: spells, isLoading, error } = useSpells();

  const getLevelName = (level: number) => {
    if (level === 0) return 'Trucchetto';
    if (level === 1) return '1°';
    if (level === 2) return '2°';
    if (level === 3) return '3°';
    return `${level}°`;
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Errore: {error.message}</div>;

  // Prepara i dati per DataTable
  const tableData = (spells as SpellRow[] | undefined)?.map((spell) => ({
    id: spell.id,
    name: spell.name,
    level: spell.level,
    level_display: getLevelName(spell.level),
    school: getItalianSchool(spell.school), // ← CONVERSIONE QUI
    casting_time: spell.casting_time || '-',
    range: spell.range || '-',
    duration: spell.duration || '-',
    components: spell.components?.join(', ') || '-',
    ritual: spell.ritual ? '✓' : '✗',
    concentration: spell.concentration ? '✓' : '✗',
    classes: getItalianClasses(spell.classes || []), // ← CONVERSIONE QUI
    description: spell.description,
    at_higher_levels: spell.at_higher_levels
  })) || [];

  return (

    <PageWrapper title="Tabella Incantesimi" variant="default">
      <DataTable
        initialData={tableData}
        visibleColumns={[
          'name',
          'level_display',
          'school',
          'casting_time',
          'range',
          'duration',
          'components',
          'ritual',
          'concentration',
          'classes'
        ]}
        labels={{
          name: 'Nome',
          level_display: 'Livello',
          school: 'Scuola',
          casting_time: 'Tempo',
          range: 'Gittata',
          duration: 'Durata',
          components: 'Componenti',
          ritual: 'Rituale',
          concentration: 'Conc.',
          classes: 'Classi'
        }}
        onRowClick={(id, row) => {
          console.log('Spell selezionata:', row);
        }}
        pagination={true}
      />
    </PageWrapper>
  );
}