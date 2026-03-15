// components/character/creation-wizard/steps/CampaignStep.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';

interface Campaign {
  id: string;
  name: string;
  description: string;
  dungeon_master: string;
}

interface CampaignStepProps {
  initialCampaignId?: string | null;
  onSelect: (campaignId: string | null) => void;
}

export function CampaignStep({ initialCampaignId, onSelect }: CampaignStepProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(initialCampaignId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica tutte le campagne disponibili via API
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) throw new Error('Errore nel caricamento delle campagne');
        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    }
    loadCampaigns();
  }, []);

  const handleContinue = () => {
    onSelect(selectedCampaignId);
  };

  const handleSkip = () => {
    onSelect(null); // Nessuna campagna
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-amber-700">Caricamento campagne...</p>
      </div>
    );
  }

  if (error) {
    return (
      <AncientCardContainer className="p-8 text-center">
        <p className="text-red-500">Errore: {error}</p>
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
      {campaigns.length > 0 ? (
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
          onClick={() => window.history.back()}
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