"use client";
import { useCampaigns } from '@/hooks/queries/useCampaigns';
import type { Campaign } from '@/types';
import Loading from '@/components/custom/Loading';
import DataTable from '@/components/custom/DataTable';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button-variants';
import { EmptyState } from '@/components/ui/empty-state';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
export default function CampaignsPage() {
    const { data: campaigns, isLoading, isError } = useCampaigns();
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
    if (isError) {
        return (
          <PageWrapper withContainer={false} title="Le Mie Campagne" maxWidth="xl">
            <EmptyState
              title="Impossibile caricare le campagne"
              description="Riprova tra qualche istante."
            />
          </PageWrapper>
        );
    }

    return (
      <PageWrapper
        withContainer={false}
        title="Le Mie Campagne"
        subtitle="Gestisci tutte le tue campagne e avventure"
        action={
          <Link
            href="/campaigns/create"
            className={cn(buttonVariants())}
          >
            <PlusCircle className="w-4 h-4" />
            Nuova Campagna
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
                customRenderers={{
                    charactersCount: (value: unknown) => (
                        <Badge variant="outline" className="surface-tile text-ink-strong">
                            {Number(value) || 0}
                        </Badge>
                    ),
                }}
                onRowClick={handleRowClick}
                pagination
            />
        </div>
      </PageWrapper>
    );
}