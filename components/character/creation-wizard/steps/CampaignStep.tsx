// components/character/creation-wizard/steps/CampaignStep.tsx
'use client';

import { useState } from 'react';
import { useCampaigns } from '@/hooks/queries/useCampaigns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import Loading from '@/components/ui/custom/Loading';

interface CampaignStepProps {
  initialCampaignId?: string | null;
  onBack: () => void;
  onSelect: (campaignId: string | null) => void;
}

export function CampaignStep({ initialCampaignId, onBack, onSelect }: CampaignStepProps) {
  const { data: campaigns, isLoading, error } = useCampaigns();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaignId || null);

  const handleContinue = () => {
    onSelect(selectedCampaignId);
  };

  const handleSkip = () => {
    onSelect(null); // Nessuna campagna
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">
          🏰 Scegli la Campagna
        </h2>
        <p className="text-amber-700 text-sm">
          Seleziona una campagna per il tuo personaggio
        </p>
      </div>

      {/* Lista campagne esistenti */}
      {campaigns && campaigns.length > 0 ? (
        <RadioGroup
          value={selectedCampaignId || ''}
          onValueChange={(v) => setSelectedCampaignId(v === '' ? null : v)}
          className="space-y-3"
        >
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-start space-x-2">
              <RadioGroupItem value={campaign.id} id={campaign.id} />
              <Label htmlFor={campaign.id} className="flex-1 cursor-pointer">
                <Card className="hover:bg-amber-50 transition-colors">
                  <CardContent className="p-4">
                    <div className="font-semibold text-amber-900">{campaign.name}</div>
                    {campaign.description && (
                      <p className="text-sm text-amber-600 mt-1">{campaign.description}</p>
                    )}
                    <p className="text-xs text-amber-500 mt-2">DM: {campaign.dungeon_master}</p>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <AncientCardContainer className="p-8 text-center">
          <p className="text-amber-700">Nessuna campagna disponibile</p>
          <p className="text-sm text-amber-500 mt-2">
            Puoi comunque creare un personaggio senza campagna
          </p>
        </AncientCardContainer>
      )}

      {/* Pulsanti navigazione */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline"
          onClick={onBack}
          className="border-amber-700 text-amber-700"
        >
          ← Indietro
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost"
            onClick={handleSkip}
            className="text-amber-600"
          >
            Salta (nessuna campagna)
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!selectedCampaignId}
            className="bg-amber-700 hover:bg-amber-800 text-amber-50"
          >
            Avanti →
          </Button>
        </div>
      </div>
    </div>
  );
}