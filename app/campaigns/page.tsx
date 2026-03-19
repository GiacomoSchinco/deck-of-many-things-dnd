"use client";
import { Button } from '@/components/ui/button';
import { useCampaigns } from '@/hooks/queries/useCampaigns';
import Loading from '@/components/custom/Loading';
import { AncientScroll } from '@/components/custom/AncientScroll';
import Link from 'next/link';
export default function CampaignsPage() {
    const { data: campaigns, isLoading } = useCampaigns();
    if (isLoading) {
        return <Loading />;
    }
  return (
    <div>
        <h1 className="text-3xl font-serif text-amber-900 mb-6">Campagne</h1>
        <div className="space-y-4">
            {campaigns?.map(campaign => (
                <AncientScroll variant='rolled' key={campaign.id}>        
                    <h2 className="text-xl font-bold text-amber-900">{campaign.name}</h2>
                    <p className="text-amber-700">{campaign.description}</p>
                    <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="outline" size="sm" className="mt-2">
                        Visualizza Dettagli
                    </Button>
                    </Link>
                </AncientScroll>
            ))} 
        </div>
    </div>
  );
}