// components/character/creation-wizard/steps/ClassStep.tsx
'use client';

import { useState } from 'react';
import { useClasses } from '@/hooks/queries/useClasses';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import Loading from '@/components/ui/custom/Loading';

interface ClassStepProps {
  initialClassId?: number | null;
  onBack: () => void;
  onSelect: (classId: number) => void;
}

export function ClassStep({ initialClassId, onBack, onSelect }: ClassStepProps) {
  const { data: classes, isLoading, error } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(initialClassId || null);

  const selectedClass = classes?.find(c => c.id === selectedClassId);

  // Formatta array in stringa leggibile
  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'Nessuna';
    return arr.join(', ');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AncientCardContainer>
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">❌ {error.message}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-amber-700 hover:bg-amber-800"
          >
            Riprova
          </Button>
        </div>
      </AncientCardContainer>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">
          ⚔️ Scegli la Classe
        </h2>
        <p className="text-amber-700 text-sm">
          La classe definisce il tuo ruolo e le tue abilità principali
        </p>
      </div>

      <RadioGroup
        value={selectedClassId !== null ? selectedClassId.toString() : ''}
        onValueChange={(value) => setSelectedClassId(parseInt(value))}
        className="space-y-3"
      >
        <ScrollArea className="h-[400px] pr-4">
          {classes?.map((dndClass) => (
            <div key={dndClass.id} className="mb-3">
              <RadioGroupItem
                value={dndClass.id.toString()}
                id={`class-${dndClass.id}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`class-${dndClass.id}`}
                className={`
                  flex flex-col p-4 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${selectedClassId === dndClass.id 
                    ? 'border-amber-700 bg-amber-50 shadow-lg' 
                    : 'border-amber-900/20 hover:border-amber-700/50 bg-parchment-50'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-serif font-bold text-amber-900">
                    {dndClass.name}
                  </span>
                  <Badge variant="outline" className="bg-amber-100">
                    Dado Vita: {dndClass.hit_die}
                  </Badge>
                </div>

                <p className="text-sm text-amber-700 mb-2 line-clamp-2">
                  {dndClass.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-amber-200 text-amber-900 border-amber-700">
                    Tiri Salvezza: {dndClass.saving_throws?.map(s => s.slice(0,3).toUpperCase()).join('/')}
                  </Badge>
                  {dndClass.spellcasting && (
                    <Badge variant="outline" className="border-purple-700 text-purple-800">
                      ✦ Magico
                    </Badge>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </ScrollArea>
      </RadioGroup>

      {/* Dettaglio classe selezionata */}
      {selectedClass && (
        <AncientCardContainer className="mt-6">
          <div className="p-4">
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-3">
              {selectedClass.name} - Caratteristiche
            </h3>
            
            <div className="space-y-3">
              {/* Competenze */}
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Armature</h4>
                <p className="text-sm text-amber-700">{formatArray(selectedClass.armor_proficiencies)}</p>
              </div>

              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Armi</h4>
                <p className="text-sm text-amber-700">{formatArray(selectedClass.weapon_proficiencies)}</p>
              </div>

              {/* Caratteristiche di livello 1 */}
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Caratteristiche (Livello 1)</h4>
                <ul className="space-y-2">
                  {selectedClass.features
                    ?.filter(f => f.level === 1)
                    .map((feature, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-medium text-amber-900">{feature.name}:</span>{' '}
                        <span className="text-amber-700">{feature.description}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Incantesimi (se presenti) */}
              {selectedClass.spellcasting && (
                <div className="bg-purple-100/50 p-2 rounded">
                  <p className="text-sm">
                    <span className="font-medium text-purple-900">Incantatore:</span>{' '}
                    <span className="text-purple-700">
                      Usa {selectedClass.spellcasting.spellcasting_ability === 'intelligence' ? 'Intelligenza' :
                           selectedClass.spellcasting.spellcasting_ability === 'wisdom' ? 'Saggezza' : 'Carisma'}
                    </span>
                  </p>
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
          onClick={() => selectedClassId && onSelect(selectedClassId)}
          disabled={!selectedClassId}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 disabled:opacity-50"
        >
          Avanti: Punteggi →
        </Button>
      </div>
    </div>
  );
}