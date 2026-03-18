// components/character/creation-wizard/steps/ClassStep.tsx
'use client';

import { useState } from 'react';
import { useClasses } from '@/hooks/queries/useClasses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RaceClassCard } from '../../../custom/RaceClassCard';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import Loading from '@/components/custom/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ClassFeature {
  level: number;
  name: string;
  description: string;
}

interface ClassStepProps {
  initialClassId?: number | null;
  onBack: () => void;
  onSelect: (classId: number) => void;
}

export function ClassStep({ initialClassId, onBack, onSelect }: ClassStepProps) {
  const { data: classes, isLoading, error } = useClasses();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(initialClassId || null);

  const selectedClass = classes?.[currentIndex];
  const totalClasses = classes?.length || 0;

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : totalClasses - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < totalClasses - 1 ? prev + 1 : 0));
  };

  const handleSelectCurrent = () => {
    if (selectedClass) {
      setSelectedClassId(selectedClass.id);
    }
  };

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

  const isSelected = selectedClassId === selectedClass.id;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-serif text-amber-900 mb-2">
          ⚔️ Scegli la tua Classe
        </h2>
        <p className="text-amber-700">
          Sfoglia le carte con le frecce e seleziona la tua classe
        </p>
      </div>

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
            id={selectedClass.id}
            name={selectedClass.name}
            type="class"
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
        {currentIndex + 1} di {totalClasses}
      </div>

      {/* Dettagli della classe corrente */}
      <AncientCardContainer className="mt-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif font-bold text-amber-900">
              {selectedClass.name}
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

      {/* Pulsanti navigazione */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-amber-700 text-amber-700"
        >
          ← Indietro
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={!selectedClassId}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 disabled:opacity-50"
        >
          Avanti: Punteggi →
        </Button>
      </div>
    </div>
  );
}