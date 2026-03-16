'use client';

import { useRaces } from '@/hooks/queries/useRaces';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import Loading from '@/components/ui/custom/Loading';

interface RaceStepProps {
  initialRaceId?: number | null;
  onBack: () => void;
  onSelect: (raceId: number) => void;
}

export function RaceStep({ initialRaceId, onBack, onSelect }: RaceStepProps) {
  const { data: races, isLoading, error } = useRaces();
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(initialRaceId || null);

  const selectedRace = races?.find(r => r.id === selectedRaceId);

  // Formatta il bonus caratteristica in modo leggibile
  const formatBonus = (bonuses: Record<string, number>) => {
    return Object.entries(bonuses)
      .map(([stat, bonus]) => {
        const statMap: Record<string, string> = {
          strength: 'FOR',
          dexterity: 'DES',
          constitution: 'COS',
          intelligence: 'INT',
          wisdom: 'SAG',
          charisma: 'CAR',
        };
        return `${statMap[stat] || stat}+${bonus}`;
      })
      .join(' · ');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AncientCardContainer className="p-6 text-center">
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
          🧝 Scegli la Razza
        </h2>
        <p className="text-amber-700 text-sm">
          La razza influenza i tuoi punteggi e ti concede abilità speciali
        </p>
      </div>

      <RadioGroup
        value={selectedRaceId !== null ? selectedRaceId.toString() : ''}
        onValueChange={(value) => setSelectedRaceId(parseInt(value))}
        className="space-y-3"
      >
        <ScrollArea className="h-[400px] pr-4">
          {races?.map((race) => (
            <div key={race.id} className="mb-3">
              <RadioGroupItem
                value={race.id.toString()}
                id={`race-${race.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`race-${race.id}`}
                className={`
                  flex flex-col p-4 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${selectedRaceId === race.id 
                    ? 'border-amber-700 bg-amber-50 shadow-lg' 
                    : 'border-amber-900/20 hover:border-amber-700/50 bg-parchment-50'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-serif font-bold text-amber-900">
                    {race.name}
                  </span>
                  <Badge variant="outline" className="bg-amber-100">
                    {race.size} · Vel. {race.speed}
                  </Badge>
                </div>

                <p className="text-sm text-amber-700 mb-2 line-clamp-2">
                  {race.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-amber-200 text-amber-900 border-amber-700">
                    {formatBonus(race.ability_bonuses)}
                  </Badge>
                  {race.traits?.slice(0, 2).map((trait, idx) => (
                    <Badge key={idx} variant="outline" className="border-amber-700 text-amber-800">
                      {trait.name}
                    </Badge>
                  ))}
                  {race.traits?.length > 2 && (
                    <Badge variant="outline" className="border-amber-700 text-amber-800">
                      +{race.traits.length - 2}
                    </Badge>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </ScrollArea>
      </RadioGroup>

      {/* Dettaglio razza selezionata */}
      {selectedRace && (
        <AncientCardContainer className="mt-6">
          <div className="p-4">
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-3">
              {selectedRace.name} - Dettagli
            </h3>
            
            <div className="space-y-3">
              {/* Tratti razziali */}
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Tratti Razziali</h4>
                <ul className="space-y-2">
                  {selectedRace.traits.map((trait, idx) => (
                    <li key={idx} className="text-sm">
                      <span className="font-medium text-amber-900">{trait.name}:</span>{' '}
                      <span className="text-amber-700">{trait.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sottorazze (se presenti) */}
              {selectedRace.subraces && selectedRace.subraces.length > 0 && (
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Sottorazze</h4>
                  <div className="space-y-2">
                    {selectedRace.subraces.map((subrace, idx) => (
                      <div key={idx} className="bg-amber-100/50 p-2 rounded">
                        <p className="font-medium text-amber-900">{subrace.name}</p>
                        <p className="text-xs text-amber-700">
                          Bonus: {formatBonus(subrace.ability_bonuses)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AncientCardContainer>
      )}

      {/* Pulsanti */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline"
          onClick={onBack}
          className="border-amber-700 text-amber-700"
        >
          ← Indietro
        </Button>
        
        <Button 
          onClick={() => selectedRaceId && onSelect(selectedRaceId)}
          disabled={!selectedRaceId}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 disabled:opacity-50"
        >
          Avanti: Scegli Classe →
        </Button>
      </div>
    </div>
  );
}