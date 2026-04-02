// app/admin/characters/page.tsx
'use client'

import { useCharacters } from '@/hooks/queries/useCharacter';
import Loading from '@/components/custom/Loading';
import DataTable from '@/components/custom/DataTable';
import AncientContainer from '@/components/custom/AncientContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getItalianClass, getItalianRace } from '@/lib/utils/nameMappers';
import { useState, useEffect } from 'react';

// Utility per estrarre il nome da strutture nested
function extractName(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    return String(obj.name ?? obj.slug ?? obj.class ?? '');
  }
  return String(value);
}

function extractNames(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(extractName).filter(Boolean);
  const name = extractName(value);
  return name ? [name] : [];
}

export default function CharactersPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data: characters, isLoading, error } = useCharacters();

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Errore: {error.message}
      </div>
    );
  }

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(new Date(iso));
  };

  const tableData = (characters ?? [])
    .map((c: Record<string, unknown>) => ({
      ...c,
      created_at_formatted: formatDate(c.created_at as string | undefined),
    }))
    .filter((c: Record<string, unknown>) => {
      if (!debouncedQuery) return true;
      const q = debouncedQuery.toLowerCase();
      return String(c.name ?? '').toLowerCase().includes(q);
    });

  return (
    <AncientContainer
      title="Gestione Personaggi"
      subtitle="Visualizza e gestisci tutti i personaggi creati dagli utenti."
      action={
        <Button
          onClick={() => router.push('/create-character')}
          className="bg-amber-700 hover:bg-amber-800 text-white shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nuovo Personaggio
        </Button>
      }
      showDecorations={false}
    >
      <div className="mb-4">
        <Input
          placeholder="Cerca per nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <DataTable
        initialData={tableData}
        visibleColumns={['name', 'classes.name', 'races.name', 'level', 'alignment', 'created_at_formatted']}
        labels={{
          name: 'Nome',
          'classes.name': 'Classe',
          'races.name': 'Razza',
          level: 'Livello',
          alignment: 'Allineamento',
          created_at_formatted: 'Creazione',
        }}
        customRenderers={{
          'classes.name': (_v, row?: Record<string, unknown>) =>
            extractNames(row?.classes).map(getItalianClass).join(', '),
          'races.name': (_v, row?: Record<string, unknown>) =>
            extractNames(row?.races).map(getItalianRace).join(', '),
        }}
        onRowClick={(id) => router.push(`/characters/${id}`)}
        pagination
      />
    </AncientContainer>
  );
}
