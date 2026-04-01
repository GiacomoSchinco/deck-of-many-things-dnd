// components/character/creation-wizard/steps/RaceStep.tsx
'use client';

import { useRaces } from '@/hooks/queries/useRaces';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { RaceClassCard } from '../../../custom/RaceClassCard';
import { getItalianRace, getAbilityShort } from '@/lib/utils/nameMappers';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { WizardStep } from '../WizardStep';
import CardSwiper, { type CardSwiperEntry } from '@/components/custom/CardSwiper';

interface RaceStepProps {
  initialRaceId?: number | null;
  onBack: () => void;
  onSelect: (raceId: number) => void;
}

export function RaceStep({ initialRaceId, onBack, onSelect }: RaceStepProps) {
  const { data: races, isLoading, error } = useRaces();
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(initialRaceId ?? null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [gotoIndex, setGotoIndex] = useState<number | undefined>(undefined);

  const selectedRace = races?.[currentIndex];
  const searchResults = search.trim()
    ? (races ?? []).filter(r => {
        const q = search.toLowerCase();
        return r.name.toLowerCase().includes(q) || getItalianRace(r.name).toLowerCase().includes(q);
      })
    : [];

  const items: CardSwiperEntry[] = (races ?? []).map(race => ({
    id: race.id,
    node: (
      <RaceClassCard
        id={race.id}
        name={race.name}
        type="race"
        isSelected={selectedRaceId === race.id}
        onSelect={() => setSelectedRaceId(race.id)}
        size="md"
      />
    ),
    label: race.name,
  }));

  const handleConfirm = () => {
    if (selectedRaceId) {
      onSelect(selectedRaceId);
    }
  };

  const formatBonus = (bonuses: Record<string, number>) => {
    return Object.entries(bonuses)
      .map(([stat, bonus]) => `${getAbilityShort(stat)}+${bonus}`)
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

  return (
    <WizardStep
      title="🧝 Scegli la tua Razza"
      subtitle="Sfoglia le carte con le frecce e seleziona la tua razza"
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={!selectedRaceId}
      nextLabel="Avanti: Scegli Classe →"
    >
      {/* Ricerca per nome */}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-amber-700 pointer-events-none" />
          <input
            type="text"
            placeholder="Cerca razza..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-md border-2 border-amber-700/50 bg-amber-50/80 text-amber-900 placeholder-amber-500 text-sm focus:outline-none focus:border-amber-700"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 text-amber-600 hover:text-amber-900">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-amber-50 border-2 border-amber-700/40 rounded-md shadow-lg overflow-hidden">
            {searchResults.map(race => {
              const idx = (races ?? []).findIndex(r => r.id === race.id);
              return (
                <button
                  key={race.id}
                  onClick={() => {
                    setSelectedRaceId(race.id);
                    setCurrentIndex(idx);
                    setGotoIndex(idx);
                    setSearch('');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-amber-900 hover:bg-amber-200 border-b border-amber-200 last:border-0 flex items-center gap-2"
                >
                  <span className="text-amber-600">🧝</span>
                  {getItalianRace(race.name)}
                  {selectedRaceId === race.id && <span className="ml-auto text-emerald-700 text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {search.trim() && searchResults.length === 0 && (
          <p className="absolute mt-1 w-full text-center text-sm text-amber-600 bg-amber-50 border border-amber-300 rounded-md py-2">Nessuna razza trovata</p>
        )}
      </div>

      {/* Carosello CardSwiper */}
      <div className="flex justify-center">
        <CardSwiper
          items={items}
          initialIndex={Math.max(0, (races ?? []).findIndex(r => r.id === initialRaceId))}
          activeIndex={gotoIndex}
          size="md"
          showLabel={false}
          onSelect={(entry) => {
            const idx = (races ?? []).findIndex(r => r.id === entry.id);
            if (idx >= 0) setCurrentIndex(idx);
          }}
        />
      </div>

      {/* Dettagli della razza corrente */}
      <AncientCardContainer className="mt-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold text-amber-900">
              {getItalianRace(selectedRace.name)}
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