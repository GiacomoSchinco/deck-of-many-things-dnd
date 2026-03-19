// components/character/creation-wizard/steps/AbilityScoresStep.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { DndIcon } from '@/components/icons/DndIcon';
import type { DndIconName } from '@/components/icons/DndIcon';
import type { AbilityScores } from '@/types/character';

interface AbilityScoresStepProps {
  initialScores?: AbilityScores | null;
  raceBonuses?: Record<string, number>;
  raceName?: string;
  onBack: () => void;
  onConfirm: (scores: AbilityScores) => void;
}

const ABILITIES = [
  { key: 'strength', label: 'FOR', name: 'Forza', icon: 'strength' },
  { key: 'dexterity', label: 'DES', name: 'Destrezza', icon: 'dexterity' },
  { key: 'constitution', label: 'COS', name: 'Costituzione', icon: 'constitution' },
  { key: 'intelligence', label: 'INT', name: 'Intelligenza', icon: 'intelligence' },
  { key: 'wisdom', label: 'SAG', name: 'Saggezza', icon: 'wisdom' },
  { key: 'charisma', label: 'CAR', name: 'Carisma', icon: 'charisma' },
];

export function AbilityScoresStep({
  initialScores,
  raceBonuses = {},
  raceName = 'la tua razza',
  onBack,
  onConfirm
}: AbilityScoresStepProps) {
  const [scores, setScores] = useState<AbilityScores>(
    initialScores || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    }
  );
  const [rollingAbility, setRollingAbility] = useState<string | null>(null);

  // Metodo: Tiro casuale (4d6 droppa il minore)
  const rollAbility = () => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
  };

  const rollSingle = (ability: keyof AbilityScores) => {
    setRollingAbility(ability);
    
    setTimeout(() => {
      const newValue = rollAbility();
      setScores(prev => ({ ...prev, [ability]: newValue }));
      setRollingAbility(null);
    }, 300);
  };

  const rollAll = () => {
    setScores({
      strength: rollAbility(),
      dexterity: rollAbility(),
      constitution: rollAbility(),
      intelligence: rollAbility(),
      wisdom: rollAbility(),
      charisma: rollAbility(),
    });
  };

  const handleConfirm = () => {
    onConfirm(scores);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">
          🎲 Punteggi di Caratteristica
        </h2>
        <p className="text-amber-700 text-sm">
          Tira 4d6 e droppa il risultato più basso per ogni caratteristica
        </p>
              {/* Pulsanti di navigazione */}
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
          className="bg-amber-700 hover:bg-amber-800 text-amber-50"
        >
          Conferma Punteggi →
        </Button>
      </div>
        {Object.keys(raceBonuses).length > 0 && (
          <div className="bg-amber-100 p-2 rounded mt-2">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{raceName}:</span> bonus razziali applicati
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {Object.entries(raceBonuses).map(([stat, bonus]) => {
                const statMap: Record<string, string> = {
                  strength: 'FOR', dexterity: 'DES', constitution: 'COS',
                  intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR'
                };
                return (
                  <span key={stat} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {statMap[stat]}+{bonus}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pulsante per tiro globale */}
      <div className="flex justify-center mb-6">
        <Button 
          onClick={rollAll} 
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 px-8 py-4 text-lg"
        >
          🎲 Tira Tutte le Caratteristiche
        </Button>
      </div>

      {/* Desktop/Tablet: griglia di card; Mobile: lista compatta */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-1 justify-items-center">
        {ABILITIES.map(({ key, name }) => {
          const baseScore = scores[key as keyof AbilityScores];
          const raceBonus = raceBonuses[key] || 0;

          return (
            <AncientCardContainer className="w-44 sm:w-48 lg:w-48 h-64 sm:h-72 lg:h-72 overflow-hidden shrink-0" key={key}>
              <div className="h-full flex flex-col relative">
                <DndIcon
                  name={`icon_${key}` as DndIconName}
                  size={120}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8 text-gold-500 pointer-events-none"
                />

                <div className="flex justify-center pt-0 z-10">
                  <div className="text-2xl text-center">{name}</div>
                </div>

                <div className="flex-1 flex items-center justify-center z-10">
                  <div className="text-center">
                    <h3 className="font-serif font-bold text-amber-900 mb-4 text-4xl">
                      {baseScore}
                      {raceBonus > 0 && (
                        <span className="text-green-600 text-xl ml-1">+{raceBonus}</span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                  <Button
                    size="sm"
                    onClick={() => rollSingle(key as keyof AbilityScores)}
                    disabled={rollingAbility === key}
                    className="bg-amber-700/80 hover:bg-amber-800 text-amber-50 text-xs px-3 py-1 rounded-full"
                  >
                    {rollingAbility === key ? '🎲 Tirando...' : '🎲 Ritira'}
                  </Button>
                </div>
              </div>
            </AncientCardContainer>
          );
        })}
      </div>

      {/* Mobile: lista compatta con pulsante di rilancio per ogni abilità */}
      <div className="flex flex-col gap-3 md:hidden mt-1">
        {ABILITIES.map(({ key, name }) => {
          const baseScore = scores[key as keyof AbilityScores];
          const raceBonus = raceBonuses[key] || 0;

          return (
            <div key={key} className="flex items-center justify-between bg-amber-50 p-3 rounded">
              <div>
                <div className="text-sm font-semibold text-amber-800">{name}</div>
                <div className="text-2xl font-serif font-bold text-amber-900">
                  {baseScore}
                  {raceBonus > 0 && <span className="text-green-600 text-lg ml-1">+{raceBonus}</span>}
                </div>
              </div>

              <div>
                <Button
                  size="sm"
                  onClick={() => rollSingle(key as keyof AbilityScores)}
                  disabled={rollingAbility === key}
                  className="bg-amber-700/80 hover:bg-amber-800 text-amber-50 text-xs px-3 py-1 rounded-full"
                >
                  {rollingAbility === key ? '🎲 Tirando...' : '🎲 Ritira'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
}