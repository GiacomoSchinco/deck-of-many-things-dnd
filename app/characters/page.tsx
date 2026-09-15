// app/characters/page.tsx
'use client'

import { useMyCharacters } from '@/hooks/queries/useCharacter';
import Loading from '@/components/custom/Loading';
import DataTable from '@/components/custom/DataTable';
import { buttonVariants } from '@/components/ui/button-variants';
import { EmptyState } from '@/components/ui/empty-state';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getItalianClass, getItalianRace } from '@/lib/utils/nameMappers';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { cn } from '@/lib/utils';

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
  const { data: characters, isLoading, error } = useMyCharacters();

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <PageWrapper withContainer={false} title="I Miei Personaggi" maxWidth="xl">
        <EmptyState
          title="Impossibile caricare i personaggi"
          description={error.message}
        />
      </PageWrapper>
    );
  }

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(new Date(iso));
  };

  const tableData = (characters ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    created_at_formatted: formatDate(c.created_at as string | undefined),
  }));

  return (
    <PageWrapper
      withContainer={false}
      title="I Miei Personaggi"
      subtitle="Gestisci tutti i tuoi eroi e compagni"
      action={
        <Link
          href="/create-character"
          className={cn(buttonVariants())}
        >
          <PlusCircle className="w-4 h-4" />
          Nuovo Personaggio
        </Link>
      }
    >
      <div className="not-prose">
      <DataTable
        initialData={tableData}
        visibleColumns={['name', 'classes.name', 'races.name', 'level', 'alignment', 'created_at_formatted']}
        labels={{
          name: 'Nome',
          'classes.name': 'Classe',
          'races.name': 'Razza',
          level: 'Livello',
          alignment: 'Allineamento',
          created_at_formatted: 'Creazione'
        }}
        customRenderers={{
          'classes.name': (_v, row?: Record<string, unknown>) => extractNames(row?.classes).map(getItalianClass).join(', '),
          'races.name': (_v, row?: Record<string, unknown>) => extractNames(row?.races).map(getItalianRace).join(', '),
        }}
        onRowClick={(id) => router.push(`/characters/${id}`)}
        pagination
      />
      </div>
    </PageWrapper>
  );
}
