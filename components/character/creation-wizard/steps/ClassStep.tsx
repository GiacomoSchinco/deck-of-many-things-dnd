// components/character/creation-wizard/steps/ClassStep.tsx
'use client';

import { useState } from 'react';
import { useClasses } from '@/hooks/queries/useClasses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { RaceClassCard } from '../../../custom/RaceClassCard';
import { getItalianClass } from '@/lib/utils/nameMappers';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { WizardStep } from '../WizardStep';
import CardSwiper, { type CardSwiperEntry } from '@/components/custom/CardSwiper';
import type { ClassFeature } from '@/types/class';


interface ClassStepProps {
  initialClassId?: number | null;
  onBack: () => void;
  onSelect: (classId: number) => void;
}

export function ClassStep({ initialClassId, onBack, onSelect }: ClassStepProps) {
  const { data: classes, isLoading, error } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(initialClassId ?? null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [gotoIndex, setGotoIndex] = useState<number | undefined>(undefined);

  const selectedClass = classes?.[currentIndex];
  const searchResults = search.trim()
    ? (classes ?? []).filter(c => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || getItalianClass(c.name).toLowerCase().includes(q);
      })
    : [];

  const items: CardSwiperEntry[] = (classes ?? []).map(cls => ({
    id: cls.id,
    node: (
      <RaceClassCard
        id={cls.id}
        name={cls.name}
        type="class"
        isSelected={selectedClassId === cls.id}
        onSelect={() => setSelectedClassId(cls.id)}
        size="md"
      />
    ),
    label: cls.name,
  }));

  const handleConfirm = () => {
    if (selectedClassId) {
      onSelect(selectedClassId);
    }
  };

  // Formatta array in stringa leggibile
  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'Nessuna';
    return arr.join(', ');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !selectedClass) {
    return (
      <AncientCardContainer className="p-6 text-center">
        <p className="text-red-500">Errore: {error?.message || 'Nessuna classe disponibile'}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Riprova
        </Button>
      </AncientCardContainer>
    );
  }

  return (
    <WizardStep
      title="⚔️ Scegli la tua Classe"
      subtitle="Sfoglia le carte con le frecce e seleziona la tua classe"
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={!selectedClassId}
      nextLabel="Avanti: Punteggi →"
    >
      {/* Ricerca per nome */}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-amber-700 pointer-events-none" />
          <input
            type="text"
            placeholder="Cerca classe..."
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
            {searchResults.map(cls => {
              const idx = (classes ?? []).findIndex(c => c.id === cls.id);
              return (
                <button
                  key={cls.id}
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setCurrentIndex(idx);
                    setGotoIndex(idx);
                    setSearch('');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-amber-900 hover:bg-amber-200 border-b border-amber-200 last:border-0 flex items-center gap-2"
                >
                  <span className="text-amber-600">⚔️</span>
                  {getItalianClass(cls.name)}
                  {selectedClassId === cls.id && <span className="ml-auto text-emerald-700 text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {search.trim() && searchResults.length === 0 && (
          <p className="absolute mt-1 w-full text-center text-sm text-amber-600 bg-amber-50 border border-amber-300 rounded-md py-2">Nessuna classe trovata</p>
        )}
      </div>

      {/* Carosello CardSwiper */}
      <div className="flex justify-center">
        <CardSwiper
          items={items}
          initialIndex={Math.max(0, (classes ?? []).findIndex(c => c.id === initialClassId))}
          activeIndex={gotoIndex}
          size="md"
          showLabel={false}
          onSelect={(entry) => {
            const idx = (classes ?? []).findIndex(c => c.id === entry.id);
            if (idx >= 0) setCurrentIndex(idx);
          }}
        />
      </div>

      {/* Dettagli della classe corrente */}
      <AncientCardContainer className="mt-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl fantasy-title">
              {getItalianClass(selectedClass.name)}
            </h3>
            <Badge variant="outline" className="bg-amber-100">
              Dado Vita: {selectedClass.hit_die}
            </Badge>
          </div>

          <p className="text-amber-700">
            {selectedClass.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tiri salvezza */}
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Tiri Salvezza</h4>
              <div className="flex flex-wrap gap-2">
                {selectedClass.saving_throws?.map((save, idx) => (
                  <Badge key={idx} className="bg-amber-200 text-amber-900 border-amber-700">
                    {save.slice(0,3).toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Incantesimi (se presenti) */}
            {selectedClass.spellcasting && (
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Incantesimi</h4>
                <Badge variant="outline" className="border-purple-700 text-purple-800">
                  ✦ Incantatore: {selectedClass.spellcasting.spellcasting_ability === 'intelligence' ? 'Intelligenza' :
                               selectedClass.spellcasting.spellcasting_ability === 'wisdom' ? 'Saggezza' : 'Carisma'}
                </Badge>
              </div>
            )}
          </div>

          {/* Competenze */}
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Competenze</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium text-amber-900">Armature:</span>{' '}
                <span className="text-amber-700">{formatArray(selectedClass.armor_proficiencies)}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-amber-900">Armi:</span>{' '}
                <span className="text-amber-700">{formatArray(selectedClass.weapon_proficiencies)}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium text-amber-900">Attrezzi:</span>{' '}
                <span className="text-amber-700">{formatArray(selectedClass.tool_proficiencies)}</span>
              </p>
            </div>
          </div>

          {/* Caratteristiche di livello 1 */}
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">Caratteristiche (Livello 1)</h4>
            <ul className="space-y-2">
              {selectedClass.features
                ?.filter((f: ClassFeature) => f.level === 1)
                .map((feature: ClassFeature, idx: number) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium text-amber-900">{feature.name}:</span>{' '}
                    <span className="text-amber-700">{feature.description}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </AncientCardContainer>
    </WizardStep>
  );
}