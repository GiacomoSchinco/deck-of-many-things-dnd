// app/characters/page.tsx
'use client'

import { useCharacters } from '@/hooks/queries/useCharacter';
import Loading from '@/components/custom/Loading';
import DataTable from '@/components/custom/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CharactersPage() {
  const router = useRouter();
  const { data: characters, isLoading, error } = useCharacters();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Errore: {error.message}
        </div>
      </div>
    );
  }

  const handleRowClick = (id: unknown) => {
    router.push(`/characters/${id}`);
  };

  function formatDate(iso?: string) {
    if (!iso) return '';
    try {
      return new Intl.DateTimeFormat('it-IT', { dateStyle: 'medium' }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  const tableData = (characters ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    created_at_formatted: formatDate(String(c['created_at'] ?? '')),
  }));

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header con titolo e pulsante nuovo personaggio */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-amber-900">
            I Miei Personaggi
          </h1>
          <p className="text-amber-700 mt-1">
            Gestisci tutti i tuoi eroi e compagni
          </p>
        </div>

        <Link href="/create-character">
          <Button className="bg-amber-700 hover:bg-amber-800">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuovo Personaggio
          </Button>
        </Link>
      </div>

      {/* Tabella dei personaggi */}
      <DataTable
        title="📜 Elenco Personaggi"
        initialData={tableData}
        visibleColumns={[
          'name',
          'classes.name',
          'races.name',
          'level',
          'alignment',
          'created_at_formatted'
        ]}
        labels={{
          name: 'Nome',
          'classes.name': 'Classe',
          'races.name': 'Razza',
          level: 'Livello',
          alignment: 'Allineamento',
          created_at_formatted: 'Creazione'
        }}
        onRowClick={(id) => handleRowClick(id)}
        pagination={true}
      />
    </div>
  );
}