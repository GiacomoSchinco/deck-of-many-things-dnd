// components/character/creation-wizard/steps/CampaignStep.tsx
'use client';

import { useState } from 'react';
import { useCampaigns } from '@/hooks/queries/useCampaigns';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { AncientScroll } from '@/components/custom/AncientScroll';
import { WizardStep } from '../WizardStep';

interface CampaignStepProps {
  initialCampaignId?: string | null;
  onBack: () => void;
  onSelect: (campaignId: string | null) => void;
}

export function CampaignStep({ initialCampaignId, onBack, onSelect }: CampaignStepProps) {
  const { data: campaigns, isLoading, error } = useCampaigns();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaignId || null);

  const handleSelect = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  const handleContinue = () => {
    onSelect(selectedCampaignId);
  };

  const handleSkip = () => {
    onSelect(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AncientCardContainer className="p-8 text-center">
        <p className="text-red-500">Errore: {error.message}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Riprova
        </Button>
      </AncientCardContainer>
    );
  }

  return (
    <WizardStep
      title="🏰 Scegli la Campagna"
      subtitle="Seleziona una campagna per il tuo personaggio"
      onBack={onBack}
      onNext={handleContinue}
      nextDisabled={!selectedCampaignId}
      nextLabel="Avanti →"
      extraActions={
        <Button variant="ghost" onClick={handleSkip} className="text-amber-600">
          Salta (nessuna campagna)
        </Button>
      }
    >
      {/* Lista campagne esistenti */}
      {campaigns && campaigns.length > 0 ? (
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const isSelected = selectedCampaignId === campaign.id;
            
            return (
              <div key={campaign.id} className="relative cursor-pointer" onClick={() => handleSelect(campaign.id)}>
                {/* Indicatore di selezione (stesso stile di RaceStep) */}
                {isSelected && (
                  <div className="absolute -top-4 -right-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Selezionata!
                  </div>
                )}
                
                <AncientScroll 
                  className={`p-10 mb-2 transition-all duration-300 ${
                    isSelected ? 'ring-4 ring-antique-gold shadow-2xl scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-xl'
                  }`} 
                  title={campaign.name} 
                  variant='rolled'
                >
                  <div className="font-semibold text-amber-900 text-lg">{campaign.name}</div>
                  {campaign.description && (
                    <p className="text-sm text-amber-600 mt-1">{campaign.description}</p>
                  )}
                  <p className="text-xs text-amber-500 mt-2">DM: {campaign.dungeon_master}</p>
                </AncientScroll>
              </div>
            );
          })}
        </div>
      ) : (
        <AncientCardContainer className="p-8 text-center">
          <p className="text-amber-700">Nessuna campagna disponibile</p>
          <p className="text-sm text-amber-500 mt-2">
            Puoi comunque creare un personaggio senza campagna
          </p>
        </AncientCardContainer>
      )}
    </WizardStep>
  );
}