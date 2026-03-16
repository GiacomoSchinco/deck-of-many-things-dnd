// components/character/creation-wizard/steps/AbilityScoresStep.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import StatDiamond from '@/components/ui/custom/StatDiaiamont';

interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface AbilityScoresStepProps {
  initialScores?: AbilityScores | null;
  raceBonuses?: Record<string, number>;
  raceName?: string;
  onBack: () => void;
  onConfirm: (scores: AbilityScores) => void;
}

// Point buy costs (5e)
const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const ABILITIES = [
  { key: 'strength', label: 'FOR', name: 'Forza' },
  { key: 'dexterity', label: 'DES', name: 'Destrezza' },
  { key: 'constitution', label: 'COS', name: 'Costituzione' },
  { key: 'intelligence', label: 'INT', name: 'Intelligenza' },
  { key: 'wisdom', label: 'SAG', name: 'Saggezza' },
  { key: 'charisma', label: 'CAR', name: 'Carisma' },
];

export function AbilityScoresStep({ 
  initialScores, 
  raceBonuses = {}, 
  raceName = 'la tua razza',
  onBack,
  onConfirm 
}: AbilityScoresStepProps) {
  const [method, setMethod] = useState<'standard' | 'pointbuy' | 'rolled' | 'manual'>('standard');
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
  const [pointBuyPoints, setPointBuyPoints] = useState(27);

  // Metodo: Tiro casuale (4d6 droppa il minore)
  const rollAbility = () => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
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

  // Metodo: Standard Array
  const setStandardArray = () => {
    setScores({
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    });
  };

  // Metodo: Point Buy
  const updatePointBuy = (ability: keyof AbilityScores, newValue: number) => {
    const currentValue = scores[ability];
    const currentCost = POINT_BUY_COSTS[currentValue];
    const newCost = POINT_BUY_COSTS[newValue];
    const pointDiff = newCost - currentCost;
    
    if (pointBuyPoints - pointDiff >= 0 && newValue >= 8 && newValue <= 15) {
      setScores(prev => ({ ...prev, [ability]: newValue }));
      setPointBuyPoints(prev => prev - pointDiff);
    }
  };

  // Metodo: Manuale
  const updateManual = (ability: keyof AbilityScores, newValue: number) => {
    if (newValue >= 3 && newValue <= 20) {
      setScores(prev => ({ ...prev, [ability]: newValue }));
    }
  };

  // Calcola i punteggi finali con bonus
  const getFinalScores = () => {
    const final = { ...scores };
    Object.entries(raceBonuses).forEach(([ability, bonus]) => {
      if (final[ability as keyof AbilityScores]) {
        final[ability as keyof AbilityScores] += bonus;
      }
    });
    return final;
  };

  const handleConfirm = () => {
    const finalScores = getFinalScores();
    onConfirm(finalScores);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-amber-900 mb-2">
          🎲 Punteggi di Caratteristica
        </h2>
        <p className="text-amber-700 text-sm">
          Distribuisci i tuoi punteggi (3-20)
        </p>
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

      <Tabs value={method} onValueChange={(v) => setMethod(v as typeof method)}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="pointbuy">Point Buy</TabsTrigger>
          <TabsTrigger value="rolled">Tiro</TabsTrigger>
          <TabsTrigger value="manual">Manuale</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <AncientCardContainer>
            <div className="p-4 text-center">
              <p className="mb-4">Array standard: 15, 14, 13, 12, 10, 8</p>
              <Button onClick={setStandardArray} variant="default">
                Usa Array Standard
              </Button>
            </div>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="pointbuy">
          <AncientCardContainer>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-amber-900 font-semibold">Punti rimasti:</span>
                <span className="text-2xl font-bold text-amber-700">{pointBuyPoints}</span>
              </div>
              <p className="text-xs text-amber-600 mb-4">
                Ogni punteggio da 8 a 15. Costi: 8(0), 9(1), 10(2), 11(3), 12(4), 13(5), 14(7), 15(9)
              </p>
              <div className="space-y-4">
                {ABILITIES.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="w-12 font-medium">{label}:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => updatePointBuy(key as keyof AbilityScores, scores[key as keyof AbilityScores] - 1)}
                        disabled={scores[key as keyof AbilityScores] <= 8}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{scores[key as keyof AbilityScores]}</span>
                      <Button
                        size="sm"
                        onClick={() => updatePointBuy(key as keyof AbilityScores, scores[key as keyof AbilityScores] + 1)}
                        disabled={
                          scores[key as keyof AbilityScores] >= 15 || 
                          pointBuyPoints < POINT_BUY_COSTS[scores[key as keyof AbilityScores] + 1] - POINT_BUY_COSTS[scores[key as keyof AbilityScores]]
                        }
                      >
                        +
                      </Button>
                      <span className="w-8 text-xs text-amber-600">
                        (costo: {POINT_BUY_COSTS[scores[key as keyof AbilityScores]]})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="rolled">
          <AncientCardContainer>
            <div className="p-4 text-center">
              <p className="mb-4">Tira 4d6 e droppa il risultato più basso</p>
              <Button onClick={rollAll} variant="default">
                🎲 Tira per tutte le caratteristiche
              </Button>
            </div>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="manual">
          <AncientCardContainer>
            <div className="p-4">
              <p className="text-sm text-amber-700 mb-4 text-center">
                Inserisci manualmente i punteggi (3-20)
              </p>
              <div className="grid grid-cols-2 gap-4">
                {ABILITIES.map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-center block">{label}</Label>
                    <Input
                      type="number"
                      min={3}
                      max={20}
                      value={scores[key as keyof AbilityScores]}
                      onChange={(e) => updateManual(
                        key as keyof AbilityScores, 
                        parseInt(e.target.value) || 10
                      )}
                      className="text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </AncientCardContainer>
        </TabsContent>
      </Tabs>

      {/* Griglia punteggi con bonus */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-6">
        {ABILITIES.map(({ key, label, name }) => {
          const baseScore = scores[key as keyof AbilityScores];
          const raceBonus = raceBonuses[key] || 0;
          const finalScore = baseScore + raceBonus;
          const modifier = calculateModifier(finalScore);

          return (
            <AncientCardContainer key={key} className="p-3 text-center">
              <div className="text-sm text-amber-700 mb-1">{label}</div>
              <div className="text-2xl font-bold text-amber-900">
                {baseScore}
                {raceBonus > 0 && (
                  <span className="text-sm text-green-600 ml-1">+{raceBonus}</span>
                )}
              </div>
              <div className="text-xs text-amber-600">
                = {finalScore} ({modifier >= 0 ? '+' : ''}{modifier})
              </div>
              <div className="text-xs text-amber-500 mt-1">{name}</div>
            </AncientCardContainer>
          );
        })}
      </div>

      {/* Riepilogo con bonus applicati */}
      <div className="p-4">
        <h3 className="font-serif font-semibold text-amber-900 mb-2 text-center">
          Punteggi Finali (con bonus razza)
        </h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {ABILITIES.map(({ key, label }) => {
            const finalScore = (scores[key as keyof AbilityScores] + (raceBonuses[key] || 0));
            const modifier = calculateModifier(finalScore);
            return (
              <StatDiamond key={key} label={label} value={finalScore} modifier={modifier} />
            );
          })}
        </div>
      </div>

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
          onClick={handleConfirm}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50"
        >
          Conferma Punteggi →
        </Button>
      </div>
    </div>
  );
}