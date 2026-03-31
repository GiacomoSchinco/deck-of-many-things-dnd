// components/character/level-up/LevelUpSummaryStep.tsx
'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Heart, TrendingUp, BookOpen, Zap } from 'lucide-react';

interface LevelUpSummaryStepProps {
  character: any;
  currentLevel: number;
  newLevel: number;
  changes: any;
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLast: boolean;
  isSaving?: boolean;
}

export default function LevelUpSummaryStep({
  character,
  currentLevel,
  newLevel,
  changes,
  data,
  onNext,
  onBack,
  isLast,
  isSaving = false,
}: LevelUpSummaryStepProps) {
  const className = character.classes?.name;
  const newTotalHp = (character.combat_stats?.max_hp || 0) + (data.hpGain || 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-serif font-bold text-amber-900">
          Riepilogo Level Up
        </h2>
        <p className="text-amber-600 text-sm mt-1">
          {character.name} sale al livello {newLevel}
        </p>
      </div>

      <div className="space-y-3">
        {/* HP */}
        <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
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
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Aumento Caratteristiche</span>
            </div>
            <p className="text-sm">
              {data.asiType === 'increase' ? (
                data.increaseType === 'single' ? (
                  <span>
                    {data.selectedStat} +2
                  </span>
                ) : (
                  <span>
                    {data.selectedStat} +1, {data.secondStat} +1
                  </span>
                )
              ) : (
                <span>Talento: {data.featId || 'Da selezionare'}</span>
              )}
            </p>
          </div>
        )}

        {/* Incantesimi */}
        {data.newSpells && data.newSpells.length > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
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
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Nuovi Slot</span>
            </div>
            <div className="text-sm">
              {Object.entries(changes.spellChanges.newSpellSlots)
                .filter(([_, count]) => count > 0)
                .map(([level, count]) => (
                  <span key={level} className="inline-block mr-2">
                    {count} slot di {level}° livello
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Nuove feature */}
        {changes.newFeatures?.length > 0 && (
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Nuove Abilità</span>
            </div>
            <div className="text-sm">
              {changes.newFeatures.map((f: any, i: number) => (
                <div key={i}>• {f.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-amber-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-amber-600 text-amber-700"
        >
          Indietro
        </Button>
        <Button
          type="button"
          onClick={() => onNext({ confirmed: true })}
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isSaving ? 'Salvataggio...' : 'Completa Level Up'}
        </Button>
      </div>
    </div>
  );
}