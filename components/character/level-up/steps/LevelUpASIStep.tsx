// components/character/level-up/LevelUpASIStep.tsx
'use client';

import { useState } from 'react';
import { WizardNav } from '@/components/shared/WizardNav';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RadioCard } from '@/components/ui/selectable-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Crown, Dumbbell, Flame, Footprints, Heart, TrendingUp, Sparkles } from 'lucide-react';
import { getItalianAbilityFull } from '@/lib/utils/nameMappers';

/** Caratteristiche con la relativa icona, per i select della scelta ASI. */
const ABILITY_OPTIONS = [
  { id: 'strength',     icon: Dumbbell },
  { id: 'dexterity',    icon: Footprints },
  { id: 'constitution', icon: Heart },
  { id: 'intelligence', icon: Brain },
  { id: 'wisdom',       icon: Flame },
  { id: 'charisma',     icon: Crown },
];

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

const featsEnabled = process.env.NEXT_PUBLIC_ENABLE_FEATS === 'true';

export default function LevelUpASIStep({
  character,
  data,
  onNext,
  onBack,
  isLast,
}: LevelUpASIStepProps) {
  const [asiType, setAsiType] = useState<'increase' | 'feat'>(featsEnabled ? ((data.asiType as 'increase' | 'feat') || 'increase') : 'increase');
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

  // Valore mostrato nel trigger del Select
  const renderStatValue = (statId: string) => {
    const current = currentStats[statId] || 10;
    const newValue = getNewValue(statId);
    const Icon = ABILITY_OPTIONS.find(s => s.id === statId)?.icon;
    return (
      <span className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-frame" />}
        <span>{getItalianAbilityFull(statId)}</span>
        <span className="stat-value text-xs text-ink-muted">
          ({current} → {newValue})
        </span>
      </span>
    );
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
          {featsEnabled ? 'Aumenta le tue statistiche o scegli un talento' : 'Aumenta le tue statistiche'}
        </p>
      </div>

      {featsEnabled && (
        <RadioGroup
          value={asiType}
          onValueChange={(v) => setAsiType(v as 'increase' | 'feat')}
          className="space-y-3"
        >
          <RadioCard
            value="increase"
            title="Aumenta caratteristiche"
            description="Aumenta una caratteristica di 2 o due caratteristiche di 1"
          />

          <RadioCard
            value="feat"
            title={
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Scegli un talento
              </span>
            }
            description="Sostituisci l'ASI con un talento speciale"
          />
        </RadioGroup>
      )}

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
                  <SelectValue>{renderStatValue(selectedStat)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ABILITY_OPTIONS.map(({ id, icon: Icon }) => (
                    <SelectItem key={id} value={id}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-frame" />
                        <span>{getItalianAbilityFull(id)}</span>
                        <span className="stat-value text-xs text-ink-muted">
                          ({currentStats[id] || 10} → {getNewValue(id)})
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
                    <SelectValue>{renderStatValue(secondStat)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ABILITY_OPTIONS
                      .filter(s => s.id !== selectedStat)
                      .map(({ id, icon: Icon }) => (
                        <SelectItem key={id} value={id}>
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-frame" />
                            <span>{getItalianAbilityFull(id)}</span>
                            <span className="stat-value text-xs text-ink-muted">
                              ({currentStats[id] || 10} → {getNewValue(id)})
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