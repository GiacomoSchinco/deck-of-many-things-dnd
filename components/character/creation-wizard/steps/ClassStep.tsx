// components/character/creation-wizard/steps/ClassStep.tsx
'use client';

import { useClasses } from '@/hooks/queries/useClasses';
import { Badge } from '@/components/ui/badge';
import { SelectionStep } from './SelectionStep';
import { getItalianClass } from '@/lib/utils/nameMappers';
import type { DndClass, ClassFeature } from '@/types/class';

interface ClassStepProps {
  initialClassId?: number | null;
  onBack: () => void;
  onSelect: (classId: number) => void;
}

export function ClassStep({ initialClassId, onBack, onSelect }: ClassStepProps) {
  const { data: classes, isLoading, error } = useClasses();

  const formatArray = (arr: string[] | undefined) =>
    !arr || arr.length === 0 ? 'Nessuna' : arr.join(', ');

  const renderDetails = (cls: DndClass) => (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl fantasy-title">{getItalianClass(cls.name)}</h3>
        <Badge variant="outline" className="bg-amber-100">
          Dado Vita: {cls.hit_die}
        </Badge>
      </div>

      <p className="text-amber-700">{cls.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-amber-800 mb-2">Tiri Salvezza</h4>
          <div className="flex flex-wrap gap-2">
            {cls.saving_throws?.map((save, idx) => (
              <Badge key={idx} className="bg-amber-200 text-amber-900 border-amber-700">
                {save.slice(0, 3).toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        {cls.spellcasting && (
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Incantesimi</h4>
            <Badge variant="outline" className="border-purple-700 text-purple-800">
              {String.fromCharCode(10022)} Incantatore:{' '}
              {cls.spellcasting.spellcasting_ability === 'intelligence'
                ? 'Intelligenza'
                : cls.spellcasting.spellcasting_ability === 'wisdom'
                ? 'Saggezza'
                : 'Carisma'}
            </Badge>
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-amber-800 mb-2">Competenze</h4>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium text-amber-900">Armature:</span>{' '}
            <span className="text-amber-700">{formatArray(cls.armor_proficiencies)}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-amber-900">Armi:</span>{' '}
            <span className="text-amber-700">{formatArray(cls.weapon_proficiencies)}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-amber-900">Attrezzi:</span>{' '}
            <span className="text-amber-700">{formatArray(cls.tool_proficiencies)}</span>
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-amber-800 mb-2">Caratteristiche (Livello 1)</h4>
        <ul className="space-y-2">
          {cls.features
            ?.filter((f: ClassFeature) => f.level === 1)
            .map((feature: ClassFeature, idx: number) => (
              <li key={idx} className="text-sm">
                <span className="font-medium text-amber-900">{feature.name}:</span>{' '}
                <span className="text-amber-700">{feature.description}</span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );

  return (
    <SelectionStep<DndClass>
      data={classes}
      isLoading={isLoading}
      error={error}
      initialId={initialClassId}
      type="class"
      title="⚔️ Scegli la tua Classe"
      subtitle="Sfoglia le carte con le frecce e seleziona la tua classe"
      nextLabel="Avanti: Punteggi →"
      searchPlaceholder="Cerca classe..."
      noResultsText="Nessuna classe trovata"
      emptyDataText="Nessuna classe disponibile"
      searchEmoji="⚔️"
      getItalianName={getItalianClass}
      onBack={onBack}
      onSelect={onSelect}
      renderDetails={renderDetails}
    />
  );
}
