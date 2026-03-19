"use client";
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/queries/useCampaigns';
import type { Campaign } from '@/types';
import Loading from '@/components/custom/Loading';
import { AncientScroll } from '@/components/custom/AncientScroll';
import DataTable from '@/components/custom/DataTable';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function CampaignsPage() {
    const { data: campaigns, isLoading } = useCampaigns();
    const router = useRouter();

    function getCharactersCount(chars: unknown): number {
        if (Array.isArray(chars)) return (chars[0] as { count: number } | undefined)?.count ?? 0;
        if (chars && typeof chars === 'object' && 'count' in (chars as Record<string, unknown>)) return (chars as { count: number }).count ?? 0;
        return 0;
    }

    const tableData = (campaigns ?? []).map(c => ({
        ...c,
        charactersCount: getCharactersCount(c.characters),
    }));
    const handleRowClick = (id: unknown) => {
        const idStr = String(id);
        router.push(`/campaigns/${idStr}`);
    }
    if (isLoading) {
        return <Loading />;
    }

    return (
           <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header con titolo e pulsante nuovo personaggio */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-amber-900">
            Le Mie Campagne
          </h1>
          <p className="text-amber-700 mt-1">
            Gestisci tutte le tue campagne e avventure
          </p>
        </div>

        <Link href="/create-campaign">
          <Button className="bg-amber-700 hover:bg-amber-800">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nuova Campagna
          </Button>
        </Link>
      </div>
            <DataTable<Campaign>
                title='Campagne'
                initialData={tableData as Campaign[]}
                visibleColumns={["name", "charactersCount"]}
                labels={{
                    name: "Nome",
                    charactersCount: "Personaggi",
                }}
                onRowClick={handleRowClick}
            />
        </div>
    );
}