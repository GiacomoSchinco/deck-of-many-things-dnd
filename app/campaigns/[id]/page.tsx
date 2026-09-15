'use client'

import Loading from '@/components/custom/Loading';
import { useCampaign } from '@/hooks/queries/useCampaigns';
import { useCharactersByCampaign } from '@/hooks/queries/useCharacter';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import { Users, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import CharacterCard from '@/components/custom/CharacterCard'; // ← importa la tua card
import { AncientScroll } from '@/components/custom/AncientScroll';
import { PageWrapper } from '@/components/layout/PageWrapper';

type CampaignCharacter = {
    id: string;
    name: string;
    level: number;
    race: string;
    class: string;
    races?: { name?: string } | null;
    classes?: { name?: string } | null;
    alignment?: string;
    background?: string;
    combat_stats?: {
        current_hp: number;
        max_hp: number;
        temp_hp: number;
    };
};

export default function CampaignPage() {
    const params = useParams();
    const idParam: string | null = (() => {
        const raw = params?.id as unknown;
        if (Array.isArray(raw)) return (raw[0] as string) ?? null;
        return (raw as string) ?? null;
    })();

    const { data: campaign, isLoading: isCampaignLoading } = useCampaign(idParam);
    const { data: characters, isLoading: isCharactersLoading } = useCharactersByCampaign(idParam);

    if (isCampaignLoading || isCharactersLoading || !campaign) {
        return <Loading />;
    }

    const formattedDate = new Date(campaign.created_at as string).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <PageWrapper
            withContainer={false}
            title={campaign.name}
            subtitle={`DM: ${campaign.dungeon_master} · ${characters?.length || 0} personaggi · ${formattedDate}`}
            action={
                <Link href={`/campaigns/${idParam}/add-character`}>
                    <Button size="sm">
                        <Sword className="w-4 h-4 mr-2" />
                        Aggiungi Personaggio
                    </Button>
                </Link>
            }
        >
            <div className="not-prose space-y-6">
            {/* Descrizione */}
            {campaign.description && (
                <AncientScroll className="p-8" variant='rolled'>
                    <p className="text-ink leading-relaxed whitespace-pre-line">
                        {campaign.description}
                    </p>
                </AncientScroll>
            )}

            {/* Personaggi con CharacterCard */}
            <div className="space-y-4">
                <h2 className="text-2xl fantasy-title flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personaggi della Campagna
                    <span className="text-sm font-normal text-amber-600 ml-2">
                        ({characters?.length || 0})
                    </span>
                </h2>

                {!characters || characters.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="Nessun personaggio in questa campagna"
                        description="Aggiungi il primo eroe per iniziare l'avventura."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(characters as CampaignCharacter[]).map((character) => {
                            // Prepara i dati per CharacterCard
                            const raceName = character.races?.name ?? character.race ?? 'Sconosciuto';
                            const className = character.classes?.name ?? character.class ?? 'Sconosciuto';
                            
                            return (
                                <CharacterCard
                                    key={character.id}
                                    id={character.id}
                                    name={character.name}
                                    race={raceName}
                                    characterClass={className}
                                    currentHp={character.combat_stats?.current_hp}
                                    maxHp={character.combat_stats?.max_hp}
                                    tempHp={character.combat_stats?.temp_hp}
                                    level={character.level || 1}
                                    background={character.background || '-'}
                                    alignment={character.alignment || 'Neutrale'}
                                    size="md"
                                />
                            );
                        })}
                    </div>
                )}
            </div>
            </div>
        </PageWrapper>
    );
}