'use client'
import Loading from '@/components/custom/Loading';
import { useCampaign } from '@/hooks/queries/useCampaigns';
import { useCharactersByCampaign } from '@/hooks/queries/useCharacter';
import { useParams } from 'next/navigation'

type CampaignCharacter = {
    id: string;
    name: string;
    level?: number;
    race?: string | null;
    class?: string | null;
    races?: { name?: string } | null;
    classes?: { name?: string } | null;
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
        if (!campaign || isCampaignLoading || isCharactersLoading) {
            return <Loading />;
        }
    return (
        <>
            <div>Campaign Page {campaign?.name}</div>
            <div>Characters:</div>
            <ul>
                {(characters as CampaignCharacter[] | undefined)?.map((character) => (
                    <li key={character.id}>
                        {character.name} - {character.races?.name ?? character.race ?? ''} - {character.classes?.name ?? character.class ?? ''} - {character.level}
                    </li>
                ))}
            </ul>
        </>
    );
}


