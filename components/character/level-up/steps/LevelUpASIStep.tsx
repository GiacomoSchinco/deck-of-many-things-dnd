// components/character/level-up/LevelUpASIStep.tsx
'use client';

import { useState } from 'react';
import { WizardNav } from '@/components/shared/WizardNav';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Sparkles } from 'lucide-react';
import { ABILITY_LIST_ICONS, getItalianAbilityFull } from '@/lib/utils/nameMappers';

interface LevelUpASIStepProps {
  character: { ability_scores?: Record<string, number> };
  currentLevel: number;
  newLevel: number;
  changes: unknown;
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  isLast: boolean;
}

export default function LevelUpASIStep({
  character,
  data,
  onNext,
  onBack,
  isLast,
}: LevelUpASIStepProps) {
  const [asiType, setAsiType] = useState<'increase' | 'feat'>((data.asiType as 'increase' | 'feat') || 'increase');
  const [selectedStat, setSelectedStat] = useState<string>((data.selectedStat as string) || 'strength');
  const [increaseType, setIncreaseType] = useState<'single' | 'double'>((data.increaseType as 'single' | 'double') || 'single');
  const [secondStat, setSecondStat] = useState<string>((data.secondStat as string) || 'dexterity');

  const currentStats = character.ability_scores || {};

  const getNewValue = (stat: string) => {
    const current = currentStats[stat] || 10;
    if (increaseType === 'single') {
      return current + 2;
    }
    return current + 1;
  };

  const handleNext = () => {
    if (asiType === 'increase') {
      if (increaseType === 'single') {
        onNext({
          asiType: 'increase',
          increaseType: 'single',
          selectedStat,
          changes: {
            [selectedStat]: getNewValue(selectedStat),
          },
        });
      } else {
        onNext({
          asiType: 'increase',
          increaseType: 'double',
          selectedStat,
          secondStat,
          changes: {
            [selectedStat]: getNewValue(selectedStat),
            [secondStat]: getNewValue(secondStat),
          },
        });
      }
    } else {
      onNext({
        asiType: 'feat',
        featId: null,
      });
    }
  };

  // Formatta il testo per il valore selezionato nel SelectTrigger
  const formatSelectValue = (statId: string) => {
    const current = currentStats[statId] || 10;
    const newValue = getNewValue(statId);
    const stat = ABILITY_LIST_ICONS.find(s => s.id === statId);
    return `${stat?.icon || '📊'} ${getItalianAbilityFull(statId)} (${current} → ${newValue})`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="fantasy-icon-wrap">
          <TrendingUp className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-xl fantasy-title">
          Aumento delle Caratteristiche
        </h2>
        <p className="fantasy-subtitle mt-1">
          Aumenta le tue statistiche o scegli un talento
        </p>
      </div>

      <RadioGroup
        value={asiType}
        onValueChange={(v) => setAsiType(v as 'increase' | 'feat')}
        className="space-y-3"
      >
        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/30">
          <RadioGroupItem value="increase" id="increase" className="mt-1" />
          <Label htmlFor="increase" className="flex-1 cursor-pointer">
            <div className="font-medium text-amber-900">Aumenta caratteristiche</div>
            <div className="text-sm text-amber-600">
              Aumenta una caratteristica di 2 o due caratteristiche di 1
            </div>
          </Label>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/30">
          <RadioGroupItem value="feat" id="feat" className="mt-1" />
          <Label htmlFor="feat" className="flex-1 cursor-pointer">
            <div className="font-medium text-amber-900 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Scegli un talento
            </div>
            <div className="text-sm text-amber-600">
              Sostituisci l&apos;ASI con un talento speciale
            </div>
          </Label>
        </div>
      </RadioGroup>

      {asiType === 'increase' && (
        <div className="mt-4 space-y-4">
          <RadioGroup
            value={increaseType}
            onValueChange={(v) => setIncreaseType(v as 'single' | 'double')}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single">Una caratteristica +2</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="double" id="double" />
              <Label htmlFor="double">Due caratteristiche +1</Label>
            </div>
          </RadioGroup>

          <div className="grid gap-4">
            <div>
              <Label>Caratteristica principale</Label>
              <Select value={selectedStat} onValueChange={(v) => v && setSelectedStat(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue>{formatSelectValue(selectedStat)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ABILITY_LIST_ICONS.map(stat => (
                    <SelectItem key={stat.id} value={stat.id}>
                      <span className="flex items-center gap-2">
                        <span>{stat.icon}</span>
                        <span>{getItalianAbilityFull(stat.id)}</span>
                        <span className="text-amber-600 text-xs ml-2">
                          ({currentStats[stat.id] || 10} → {getNewValue(stat.id)})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {increaseType === 'double' && (
              <div>
                <Label>Seconda caratteristica</Label>
                <Select value={secondStat} onValueChange={(v) => v && setSecondStat(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue>{formatSelectValue(secondStat)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ABILITY_LIST_ICONS
                      .filter(s => s.id !== selectedStat)
                      .map(stat => (
                        <SelectItem key={stat.id} value={stat.id}>
                          <span className="flex items-center gap-2">
                            <span>{stat.icon}</span>
                            <span>{getItalianAbilityFull(stat.id)}</span>
                            <span className="text-amber-600 text-xs ml-2">
                              ({currentStats[stat.id] || 10} → {getNewValue(stat.id)})
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {asiType === 'feat' && (
        <div className="mt-4 p-4 fantasy-section text-center">
          <p className="text-amber-700 text-sm">
            ⚠️ Selezione talenti in arrivo
          </p>
          <p className="text-xs text-amber-500 mt-1">
            Per ora puoi procedere senza talento
          </p>
        </div>
      )}

      <WizardNav
        onBack={onBack}
        onNext={handleNext}
        nextLabel={isLast ? 'Conferma ✓' : 'Avanti →'}
      />
    </div>
  );
}