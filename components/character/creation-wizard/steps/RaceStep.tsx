// components/character/creation-wizard/steps/RaceStep.tsx
'use client';

import { useRaces } from '@/hooks/queries/useRaces';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RaceClassCard } from '../../../custom/RaceClassCard';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WizardStep } from '../WizardStep';

interface RaceStepProps {
  initialRaceId?: number | null;
  onBack: () => void;
  onSelect: (raceId: number) => void;
}

export function RaceStep({ initialRaceId, onBack, onSelect }: RaceStepProps) {
  const { data: races, isLoading, error } = useRaces();
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(initialRaceId ?? null);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialRaceId || !races) return 0;
    const idx = races.findIndex(r => r.id === initialRaceId);
    return idx >= 0 ? idx : 0;
  });

  const selectedRace = races?.[currentIndex];
  const totalRaces = races?.length || 0;

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalRaces - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < totalRaces - 1 ? prev + 1 : 0));
  };

  const handleSelectCurrent = () => {
    if (selectedRace) {
      setSelectedRaceId(selectedRace.id);
    }
  };

  const handleConfirm = () => {
    if (selectedRaceId) {
      onSelect(selectedRaceId);
    }
  };

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

  if (error || !selectedRace) {
    return (
      <AncientCardContainer className="p-6 text-center">
        <p className="text-red-500">Errore: {error?.message || 'Nessuna razza disponibile'}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Riprova
        </Button>
      </AncientCardContainer>
    );
  }

  const isSelected = selectedRaceId === selectedRace.id;

  return (
    <WizardStep
      title="🧝 Scegli la tua Razza"
      subtitle="Sfoglia le carte con le frecce e seleziona la tua razza"
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={!selectedRaceId}
      nextLabel="Avanti: Scegli Classe →"
    >
      {/* Carosello principale */}
      <div className="relative flex items-center justify-center gap-4">
        {/* Freccia sinistra */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="rounded-full border-2 border-amber-700 text-amber-700 hover:bg-amber-100 w-12 h-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Carta centrale */}
        <div className="relative">
          <RaceClassCard
            id={selectedRace.id}
            name={selectedRace.name}
            type="race"
            isSelected={isSelected}
            onSelect={handleSelectCurrent}
            size="md"
          />
          
          {/* Indicatore di selezione */}
          {isSelected && (
            <div className="absolute -top-4 -right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Selezionata!
            </div>
          )}
        </div>

        {/* Freccia destra */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="rounded-full border-2 border-amber-700 text-amber-700 hover:bg-amber-100 w-12 h-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Indicatore di posizione */}
      <div className="text-center text-amber-600">
        {currentIndex + 1} di {totalRaces}
      </div>

      {/* Dettagli della razza corrente */}
      <AncientCardContainer className="mt-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold text-amber-900">
              {selectedRace.name}
            </h3>
            <Badge variant="outline" className="bg-amber-100">
              {selectedRace.size} · Vel. {selectedRace.speed}
            </Badge>
          </div>

          <p className="text-amber-700">
            {selectedRace.description}
          </p>

          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Bonus Caratteristica</h4>
            <Badge className="bg-amber-200 text-amber-900 border-amber-700">
              {formatBonus(selectedRace.ability_bonuses)}
            </Badge>
          </div>

          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Tratti Razziali</h4>
            <ul className="list-disc list-inside space-y-1">
              {selectedRace.traits?.map((trait, idx) => (
                <li key={idx} className="text-sm text-amber-700">
                  <span className="font-medium text-amber-900">{trait.name}:</span> {trait.description}
                </li>
              ))}
            </ul>
          </div>

          {selectedRace.subraces && selectedRace.subraces.length > 0 && (
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Sottorazze</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRace.subraces.map((subrace, idx) => (
                  <Badge key={idx} variant="outline" className="border-amber-700 text-amber-800">
                    {subrace.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AncientCardContainer>
    </WizardStep>
  );
}