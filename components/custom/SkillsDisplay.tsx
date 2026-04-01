// components/character/sheet/SkillsDisplay.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle2, Star, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Skill } from '@/types/skill';
import type { AbilityScores, ProficiencyType } from '@/types/character';
import { getAbilityShort, getItalianAbilityFull } from '@/lib/utils/nameMappers';

interface SkillsDisplayProps {
  information?: boolean;
  /** Numero di colonne della griglia (default: 3) */
  gridCols?: 1 | 2 | 3 | 4;
  skills: Skill[];
  characterSkills: Map<number, ProficiencyType>;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  className?: string;
}

export function SkillsDisplay({
  skills,
  gridCols = 3,
  characterSkills,
  abilityScores,
  proficiencyBonus,
  information = true
}: SkillsDisplayProps) {

  const getSkillBonus = (skill: Skill) => {
    const abilityScore = abilityScores[skill.ability as keyof typeof abilityScores] || 10;
    const abilityMod = calculateModifier(abilityScore);
    const proficiency = characterSkills.get(skill.id);

    if (!proficiency || proficiency === 'none') {
      return abilityMod;
    }

    if (proficiency === 'proficient') {
      return abilityMod + proficiencyBonus;
    }

    if (proficiency === 'expertise') {
      return abilityMod + proficiencyBonus * 2;
    }

    if (proficiency === 'half') {
      return abilityMod + Math.floor(proficiencyBonus / 2);
    }

    return abilityMod;
  };

  const getBonusBreakdown = (skill: Skill) => {
    const abilityScore = abilityScores[skill.ability as keyof typeof abilityScores] || 10;
    const abilityMod = calculateModifier(abilityScore);
    const proficiency = characterSkills.get(skill.id);

    if (!proficiency || proficiency === 'none') {
      return `${abilityMod >= 0 ? `+${abilityMod}` : abilityMod}`;
    }

    if (proficiency === 'proficient') {
      return `${abilityMod >= 0 ? `+${abilityMod}` : abilityMod} + ${proficiencyBonus} (competenza)`;
    }

    if (proficiency === 'expertise') {
      return `${abilityMod >= 0 ? `+${abilityMod}` : abilityMod} + ${proficiencyBonus} × 2 (perizia)`;
    }

    if (proficiency === 'half') {
      return `${abilityMod >= 0 ? `+${abilityMod}` : abilityMod} + ${Math.floor(proficiencyBonus / 2)} (mezza competenza)`;
    }

    return `${abilityMod >= 0 ? `+${abilityMod}` : abilityMod}`;
  };

  const selectedCount = Array.from(characterSkills.values()).filter(
    v => v !== 'none'
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-serif font-bold text-amber-900 flex items-center gap-2">
          <span>🎯</span>Abilità
          {information && (
            selectedCount > 0 && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-sm">
                {selectedCount} selezionate
              </Badge>
            )
          )}
        </h3>

        <div className="text-xs text-amber-600 flex items-center gap-2 bg-amber-100/50 p-2 rounded-lg border border-amber-200">
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 fill-green-500 text-green-500" />
            <span>Competente</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
            <span>Perizia</span>
          </div>
          <div className="w-px h-3 bg-amber-300" />
          <span>
            Bonus competenza: <strong className="text-amber-800">+{proficiencyBonus}</strong>
          </span>
        </div>
      </div>

      {/* Griglia abilità */}
      <div className={cn(
        'gap-3',
        gridCols === 1 ? 'grid grid-cols-1' :
        gridCols === 2 ? 'grid grid-cols-1 md:grid-cols-2' :
        gridCols === 4 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {skills.map((skill) => {
          const proficiency = characterSkills.get(skill.id);
          const isSelected = proficiency && proficiency !== 'none';
          const isExpertise = proficiency === 'expertise';
          const bonus = getSkillBonus(skill);
          const abilityScore = abilityScores[skill.ability as keyof typeof abilityScores] || 10;
          const abilityMod = calculateModifier(abilityScore);

          return (
            <div
              key={skill.id}
              className={cn(
                'group relative flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 min-h-[70px]',
                isExpertise
                  ? 'border-blue-400 bg-gradient-to-r from-blue-50/80 to-amber-50/50 shadow-md'
                  : isSelected
                    ? 'border-amber-500 bg-gradient-to-r from-amber-100/80 to-amber-50/50 shadow-sm'
                    : 'border-amber-200/60 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-100/40'
              )}
            >
              {/* Bordo laterale decorativo */}
              {(isSelected || isExpertise) && (
                <div className={cn(
                  'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
                  isExpertise ? 'bg-blue-500' : 'bg-amber-600'
                )} />
              )}

              <div className="flex-1 ml-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "font-serif font-semibold text-base",
                    isExpertise ? "text-blue-800" :
                      isSelected ? "text-amber-800" : "text-amber-700"
                  )}>
                    {skill.name_it}
                  </span>
                  {isExpertise && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs gap-1">
                      <Star className="w-3 h-3" />
                      Perizia
                    </Badge>
                  )}
                  {isSelected && !isExpertise && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Competente
                    </Badge>
                  )}
                </div>
                <p className={cn(
                  'text-xs mt-0.5 font-mono',
                  isExpertise ? 'text-blue-600' :
                    isSelected ? 'text-amber-600' : 'text-amber-500'
                )}>

                  {getAbilityShort(skill.ability)} ({abilityMod >= 0 ? `+${abilityMod}` : abilityMod})
                  {information && (
                    <span>
                      {isSelected && (
                        <span className="ml-1 text-amber-500 text-[10px]">
                          • competenza attiva
                        </span>
                      )}
                    </span>
                  )}

                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Bonus */}
                <div className="text-right">
                  <span
                    className={cn(
                      'text-2xl font-bold font-mono tracking-tight',
                      isExpertise ? 'text-blue-700' :
                        isSelected ? 'text-amber-800' : 'text-amber-500'
                    )}
                    title={`Calcolo: ${getBonusBreakdown(skill)} = ${bonus >= 0 ? `+${bonus}` : bonus}`}
                  >
                    {bonus >= 0 ? `+${bonus}` : bonus}
                  </span>
                </div>

                {/* Pulsante info */}
                {skill.description && (
                  <Dialog>
                    <DialogTrigger
                      className="p-1 rounded-full hover:bg-amber-200/50 transition-colors text-amber-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Info abilità"
                    >
                      <Info className="w-4 h-4" />
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-parchment-100 border-2 border-amber-900/30">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-amber-900 flex items-center gap-2">
                          <span>📖</span> {skill.name_it}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <Badge variant="outline" className="border-amber-600">
                            {getItalianAbilityFull(skill.ability)}
                          </Badge>
                          {isExpertise && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                              <Star className="w-3 h-3 mr-1" />
                              Perizia
                            </Badge>
                          )}
                          {isSelected && !isExpertise && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Competente
                            </Badge>
                          )}
                        </div>

                        <div className="bg-amber-100/50 p-4 rounded-lg border border-amber-200">
                          <p className="text-amber-800 leading-relaxed">
                            {skill.description}
                          </p>
                        </div>

                        <div className="border-t border-amber-200 pt-3 text-xs text-amber-600">
                          <p className="font-semibold">Bonus attuale:</p>
                          <p className="font-mono mt-1 bg-amber-100 inline-block px-2 py-1 rounded">
                            {getBonusBreakdown(skill)} = <strong className="text-amber-800">{bonus >= 0 ? `+${bonus}` : bonus}</strong>
                          </p>
                          <p className="mt-2">
                            Prova di {skill.name_it}: <span className="font-mono">1d20 + {bonus >= 0 ? bonus : `(${bonus})`}</span>
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      {/*      <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-amber-500 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-amber-600 rounded-full" />
            <span>Bordo = competenza selezionata</span>
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-600" />
            <span>Icona = competenza attiva</span>
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-blue-500" />
            <span>Stella = perizia (doppio bonus)</span>
          </span>
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>ℹ️ al passaggio del mouse per dettagli</span>
          </span>
        </div>
        <p className="mt-2 text-amber-400 text-[10px]">
          Bonus totale = modificatore caratteristica {proficiencyBonus ? `+ bonus competenza (${proficiencyBonus})` : ''}
          {proficiencyBonus && ' ×2 se perizia'}
        </p>
      </div>*/}
    </div>
  );
}