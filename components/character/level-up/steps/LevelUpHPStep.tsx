// components/character/level-up/LevelUpHPStep.tsx
'use client';

import { useState } from 'react';
import { AntiqueButton } from '@/components/custom/AntiqueButton';
import { WizardNav } from '@/components/shared/WizardNav';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dice6, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelUpHPStepProps {
  character: { hit_dice_type?: string; ability_scores?: Record<string, number>; combat_stats?: { max_hp?: number } };
  currentLevel: number;
  newLevel: number;
  changes: {
    averageHpGain: number;
    hitDiceType: string;
  };
  data: Record<string, unknown>;
  onNext: (data: { hpGain: number; hpMethod: string; rolledValue: number | null }) => void;
  onBack: () => void;
  isLast: boolean;
}

const hitDiceValues: Record<string, number> = {
  d6: 4,   // media arrotondata per eccesso (3.5 → 4)
  d8: 5,   // 4.5 → 5
  d10: 6,  // 5.5 → 6
  d12: 7,  // 6.5 → 7
};

export default function LevelUpHPStep({
  character,
  // currentLevel, newLevel, changes are part of the standard step interface
  data,
  onNext,
  onBack,
  isLast,
}: LevelUpHPStepProps) {
  const [method, setMethod] = useState<'average' | 'roll'>((data.hpMethod as 'average' | 'roll') || 'average');
  const [rolledValue, setRolledValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const hitDiceType = character.hit_dice_type || 'd8';
  const hitDiceMax = hitDiceValues[hitDiceType] || 5;
  const conMod = Math.floor(((character.ability_scores?.constitution ?? 10) - 10) / 2) || 0;
  const averageGain = hitDiceMax + conMod;

  const rollHitDice = () => {
    setIsRolling(true);
    // Simula il tiro del dado
    const diceSize = parseInt(hitDiceType.replace('d', ''));
    const roll = Math.floor(Math.random() * diceSize) + 1;
    setRolledValue(roll);
    setTimeout(() => setIsRolling(false), 500);
  };

  const finalHpGain = method === 'average' ? averageGain : (rolledValue || 0) + conMod;
  const newTotalHp = (character.combat_stats?.max_hp ?? 0) + finalHpGain;

  const handleNext = () => {
    onNext({
      hpGain: finalHpGain,
      hpMethod: method,
      rolledValue: method === 'roll' ? rolledValue : null,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="fantasy-icon-wrap">
          <Heart className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-xl fantasy-title">
          Punti Ferita
        </h2>
        <p className="fantasy-subtitle mt-1">
          Scegli come aumentare i tuoi PF
        </p>
      </div>

      <div className="fantasy-section p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-amber-500">PF attuali</p>
            <p className="text-2xl font-bold text-amber-900">{character.combat_stats?.max_hp || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-amber-500">Nuovi PF</p>
            <p className="text-2xl font-bold text-amber-900">{newTotalHp}</p>
          </div>
        </div>

        <div className="text-center text-sm text-amber-600 mb-4">
          Dado vita: {hitDiceType} • Mod COS: {conMod > 0 ? `+${conMod}` : conMod}
        </div>
      </div>

      <RadioGroup
        value={method}
        onValueChange={(v) => setMethod(v as 'average' | 'roll')}
        className="space-y-3"
      >
        <div className={cn(
          "flex items-start gap-3 p-3 rounded-lg border transition-all",
          method === 'average' ? "border-amber-500 bg-amber-50" : "border-amber-200"
        )}>
          <RadioGroupItem value="average" id="average" className="mt-1" />
          <Label htmlFor="average" className="flex-1 cursor-pointer">
            <div className="font-medium text-amber-900">Valore medio</div>
            <div className="text-sm text-amber-600">
              {hitDiceMax} + {conMod} = <strong className="text-amber-800">+{averageGain} PF</strong>
            </div>
            <div className="text-xs text-amber-500 mt-1">
              Consigliato per una crescita stabile
            </div>
          </Label>
        </div>

        <div className={cn(
          "flex items-start gap-3 p-3 rounded-lg border transition-all",
          method === 'roll' ? "border-amber-500 bg-amber-50" : "border-amber-200"
        )}>
          <RadioGroupItem value="roll" id="roll" className="mt-1" />
          <Label htmlFor="roll" className="flex-1 cursor-pointer">
            <div className="font-medium text-amber-900">Tiro del dado</div>
            <div className="text-sm text-amber-600">
              {rolledValue ? (
                <span>
                  {rolledValue} + {conMod} = <strong className="text-amber-800">+{rolledValue + conMod} PF</strong>
                </span>
              ) : (
                <span>Non ancora tirato</span>
              )}
            </div>
            <AntiqueButton
              type="button"
              variant="outline"
              size="sm"
              onClick={rollHitDice}
              disabled={isRolling || method !== 'roll'}
              icon={<Dice6 className={cn("w-4 h-4", isRolling && "animate-spin")} />}
            >
              {isRolling ? 'Tirando...' : 'Tira il dado'}
            </AntiqueButton>
          </Label>
        </div>
      </RadioGroup>

      <WizardNav
        onBack={onBack}
        onNext={handleNext}
        nextLabel={isLast ? 'Conferma ✓' : 'Avanti →'}
        nextDisabled={method === 'roll' && !rolledValue}
      />
    </div>
  );
}