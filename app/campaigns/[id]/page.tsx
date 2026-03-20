'use client'

import Loading from '@/components/custom/Loading';
import { useCampaign } from '@/hooks/queries/useCampaigns';
import { useCharactersByCampaign } from '@/hooks/queries/useCharacter';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import { Users, Calendar, User, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharacterCard from '@/components/custom/CharacterCard'; // ← importa la tua card
import { AncientScroll } from '@/components/custom/AncientScroll';

type CampaignCharacter = {
    id: number; // ← attenzione: id deve essere number per CharacterCard
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
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900">
                        {campaign.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-amber-700">
                        <span className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-sm">
                            <User className="w-4 h-4" />
                            DM: {campaign.dungeon_master}
                        </span>
                        <span className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-sm">
                            <Users className="w-4 h-4" />
                            {characters?.length || 0} personaggi
                        </span>
                        <span className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-sm">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                    </div>
                </div>

                <Link href={`/campaigns/${idParam}/add-character`}>
                    <Button size="sm">
                        <Sword className="w-4 h-4 mr-2" />
                        Aggiungi Personaggio
                    </Button>
                </Link>
            </div>

            {/* Descrizione */}
            {campaign.description && (
                <AncientScroll className="p-15" variant='rolled'>
                    <p className="text-amber-700 leading-relaxed whitespace-pre-line">
                        {campaign.description}
                    </p>
                </AncientScroll>
            )}

            {/* Personaggi con CharacterCard */}
            <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-amber-900 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personaggi della Campagna
                    <span className="text-sm font-normal text-amber-600 ml-2">
                        ({characters?.length || 0})
                    </span>
                </h2>

                {!characters || characters.length === 0 ? (
                    <AncientScroll className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <Users className="w-16 h-16 text-amber-700/30" />
                            <p className="text-amber-700 text-lg">Nessun personaggio in questa campagna</p>
                            <p className="text-amber-600 text-sm">Clicca su &quot;Aggiungi Personaggio&quot; per iniziare</p>
                        </div>
                    </AncientScroll>
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
    );
}