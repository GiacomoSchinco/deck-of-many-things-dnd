"use client";
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/queries/useCampaigns';
import type { Campaign } from '@/types';
import Loading from '@/components/custom/Loading';
import DataTable from '@/components/custom/DataTable';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
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
      <PageWrapper
        withContainer={false}
        title="Le Mie Campagne"
        subtitle="Gestisci tutte le tue campagne e avventure"
        action={
          <Link href="/campaigns/create">
            <Button className="bg-amber-700 hover:bg-amber-800">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nuova Campagna
            </Button>
          </Link>
        }
      >
        <div className="not-prose">
        <DataTable<Campaign>
                initialData={tableData as Campaign[]}
                visibleColumns={["name", "charactersCount"]}
                labels={{
                    name: "Nome",
                    charactersCount: "Personaggi",
                }}
                onRowClick={handleRowClick}
            />
        </div>
      </PageWrapper>
    );
}