// components/character/level-up/LevelUpSummaryStep.tsx
'use client';

import { WizardNav } from '@/components/shared/WizardNav';
import { CheckCircle2, Heart, TrendingUp, BookOpen, Zap } from 'lucide-react';

interface SummaryCharacter {
  name: string;
  classes?: { name?: string } | null;
  combat_stats?: { max_hp?: number } | null;
}

interface SpellChanges {
  newSpellSlots?: Record<string, number>;
}

interface SummaryChanges {
  spellChanges?: SpellChanges;
  newFeatures?: { name: string; description: string; level: number; icon?: string }[];
}

interface SummaryData {
  hpGain?: number;
  asiType?: 'increase' | 'feat';
  increaseType?: 'single' | 'double';
  selectedStat?: string;
  secondStat?: string;
  featId?: string;
  newSpells?: string[];
}

interface LevelUpSummaryStepProps {
  character: SummaryCharacter;
  currentLevel: number;
  newLevel: number;
  changes: SummaryChanges;
  data: SummaryData;
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  isLast: boolean;
  isSaving?: boolean;
}

export default function LevelUpSummaryStep({
  character,
  newLevel,
  changes,
  data,
  onNext,
  onBack,
  isSaving = false,
}: LevelUpSummaryStepProps) {
  const newTotalHp = (character.combat_stats?.max_hp || 0) + (data.hpGain || 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="fantasy-icon-wrap">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl fantasy-title">
          Riepilogo Level Up
        </h2>
        <p className="fantasy-subtitle mt-1">
          {character.name} sale al livello {newLevel}
        </p>
      </div>

      <div className="space-y-3">
        {/* HP */}
        <div className="fantasy-section p-3">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <Heart className="w-4 h-4" />
            <span className="font-medium">Punti Ferita</span>
          </div>
          <p className="text-sm">
            {character.combat_stats?.max_hp} → <strong>{newTotalHp}</strong> (+{data.hpGain})
          </p>
        </div>

        {/* ASI */}
        {data.asiType !== undefined && (
          <div className="fantasy-section p-3">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Aumento Caratteristiche</span>
            </div>
            <p className="text-sm">
              {data.asiType === 'increase' ? (
                data.increaseType === 'single' ? (
                  <span>{data.selectedStat} +2</span>
                ) : (
                  <span>{data.selectedStat} +1, {data.secondStat} +1</span>
                )
              ) : (
                <span>Talento: {data.featId || 'Da selezionare'}</span>
              )}
            </p>
          </div>
        )}

        {/* Incantesimi */}
        {data.newSpells && data.newSpells.length > 0 && (
          <div className="fantasy-section p-3">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Nuovi Incantesimi</span>
            </div>
            <p className="text-sm">
              {data.newSpells.length} nuovi incantesimi appresi
            </p>
          </div>
        )}

        {/* Nuovi slot */}
        {changes.spellChanges?.newSpellSlots && (
          <div className="fantasy-section p-3">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Nuovi Slot</span>
            </div>
            <div className="text-sm">
              {Object.entries(changes.spellChanges.newSpellSlots)
                .filter(([, count]) => count > 0)
                .map(([level, count]) => (
                  <span key={level} className="inline-block mr-2">
                    {count} slot di {level}° livello
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Nuove feature */}
        {changes.newFeatures && changes.newFeatures.length > 0 && (
          <div className="fantasy-section p-3">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Nuove Abilità</span>
            </div>
            <div className="text-sm">
              {changes.newFeatures.map((f, i) => (
                <div key={i}>• {f.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <WizardNav
        onBack={onBack}
        onNext={() => onNext({ confirmed: true })}
        nextLabel={isSaving ? 'Salvataggio...' : 'Completa Level Up ✓'}
        nextLoading={isSaving}
        nextDisabled={isSaving}
      />
    </div>
  );
}
