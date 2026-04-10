// components/character/creation-wizard/steps/RaceStep.tsx
'use client';

import { useRaces } from '@/hooks/queries/useRaces';
import { Badge } from '@/components/ui/badge';
import { SelectionStep } from './SelectionStep';
import { getItalianRace, getAbilityShort } from '@/lib/utils/nameMappers';
import type { Race } from '@/types/race';

interface RaceStepProps {
  initialRaceId?: number | null;
  onBack: () => void;
  onSelect: (raceId: number) => void;
}

export function RaceStep({ initialRaceId, onBack, onSelect }: RaceStepProps) {
  const { data: races, isLoading, error } = useRaces();

  const formatBonus = (bonuses: Record<string, number>) =>
    Object.entries(bonuses)
      .map(([stat, bonus]) => `${getAbilityShort(stat)}+${bonus}`)
      .join(' · ');

  const renderDetails = (race: Race) => (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl fantasy-title">{getItalianRace(race.name)}</h3>
        <Badge variant="outline" className="bg-amber-100">
          {race.size} · Vel. {race.speed}
        </Badge>
      </div>

      <p className="text-amber-700">{race.description}</p>

      <div>
        <h4 className="font-semibold text-amber-800 mb-2">Bonus Caratteristica</h4>
        <Badge className="bg-amber-200 text-amber-900 border-amber-700">
          {formatBonus(race.ability_bonuses)}
        </Badge>
      </div>

      <div>
        <h4 className="font-semibold text-amber-800 mb-2">Tratti Razziali</h4>
        <ul className="list-disc list-inside space-y-1">
          {race.traits?.map((trait, idx) => (
            <li key={idx} className="text-sm text-amber-700">
              <span className="font-medium text-amber-900">{trait.name}:</span> {trait.description}
            </li>
          ))}
        </ul>
      </div>

      {race.subraces && race.subraces.length > 0 && (
        <div>
          <h4 className="font-semibold text-amber-800 mb-2">Sottorazze</h4>
          <div className="flex flex-wrap gap-2">
            {race.subraces.map((subrace, idx) => (
              <Badge key={idx} variant="outline" className="border-amber-700 text-amber-800">
                {subrace.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <SelectionStep<Race>
      data={races}
      isLoading={isLoading}
      error={error}
      initialId={initialRaceId}
      type="race"
      title="🧝 Scegli la tua Razza"
      subtitle="Sfoglia le carte con le frecce e seleziona la tua razza"
      nextLabel="Avanti: Scegli Classe →"
      searchPlaceholder="Cerca razza..."
      noResultsText="Nessuna razza trovata"
      emptyDataText="Nessuna razza disponibile"
      searchEmoji="🧝"
      getItalianName={getItalianRace}
      onBack={onBack}
      onSelect={onSelect}
      renderDetails={renderDetails}
    />
  );
}

