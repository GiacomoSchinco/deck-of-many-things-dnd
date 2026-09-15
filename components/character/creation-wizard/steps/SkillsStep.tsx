// components/character/creation-wizard/steps/SkillsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClass } from '@/hooks/queries/useClasses';
import { useSkillList } from '@/hooks/queries/useSkills';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SelectableCard } from '@/components/ui/selectable-card';
import { Note } from '@/components/ui/note';
import { Checkbox } from '@/components/ui/checkbox';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { BookOpen } from 'lucide-react';
import { WizardStep } from '../WizardStep';
import type { Skill } from '@/types/skill';
import Loading from '@/components/custom/Loading';
import { getAbilityShort } from '@/lib/utils/nameMappers';
import type { AbilityScores } from '@/types/character';

interface SkillsStepProps {
  classId: number;
  abilityScores: AbilityScores;
  onConfirm: (selectedSkills: string[]) => void;
  onChange?: (selectedSkills: string[]) => void;
  initialSelectedSkills?: string[];
  onBack: () => void;
}

export function SkillsStep({ classId, abilityScores, onConfirm, onChange, initialSelectedSkills, onBack }: SkillsStepProps) {
  const { data: classData, isLoading: classLoading } = useClass(classId);
  const { data: allSkills, isLoading: skillsLoading } = useSkillList();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSelectedSkills ?? []);


  const { maxChoices, availableSkills } = useMemo(() => {
    if (!classData?.skill_choices || !allSkills) {
      return { maxChoices: 0, availableSkills: [] as Skill[] };
    }
    
    const choices = classData.skill_choices;
    const count = choices.count || 0;
    const options = choices.options || [];

    // Filtra le skill disponibili
    const available = allSkills.filter(skill => 
      options.includes(skill.name) ||           // nome inglese
      options.includes(skill.name_it) ||        // nome italiano
      options.includes(skill.name.toLowerCase()) // lowercase
    );

    return { maxChoices: count, availableSkills: available };
  }, [classData, allSkills]);

  const toggleSkill = (skillId: number) => {
    const skillIdStr = String(skillId);
    let next: string[];
    if (selectedSkills.includes(skillIdStr)) {
      next = selectedSkills.filter(id => id !== skillIdStr);
    } else {
      if (selectedSkills.length >= maxChoices) return;
      next = [...selectedSkills, skillIdStr];
    }
    setSelectedSkills(next);
    onChange?.(next);
  };

  const getModifier = (ability: string) => {
    const score = abilityScores[ability as keyof typeof abilityScores];
    return Math.floor((score - 10) / 2);
  };

  const handleConfirm = () => {
    if (selectedSkills.length === maxChoices) {
      onConfirm(selectedSkills);
    }
  };

  if (classLoading || skillsLoading) {
    return (
      <Loading />
    );
  }

  if (!classData?.skill_choices) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-700">Questa classe non ha competenze da scegliere</p>
        <Button onClick={() => onConfirm([])} className="mt-4 bg-amber-700 hover:bg-amber-800">
          Continua
        </Button>
      </div>
    );
  }

  if (!allSkills || availableSkills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-700">Nessuna competenza disponibile</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          Torna indietro
        </Button>
      </div>
    );
  }

  return (
    <WizardStep
      title="Competenze di Classe"
      icon={BookOpen}
      subtitle={`Scegli ${maxChoices} competenze in cui essere addestrato`}
      onBack={onBack}
      onNext={handleConfirm}
      nextDisabled={selectedSkills.length !== maxChoices}
      nextLabel="Conferma Competenze →"
    >
      <p className="text-xs text-amber-500 text-center -mt-4">
        {selectedSkills.length}/{maxChoices} selezionate
      </p>
      <AncientCardContainer className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSkills.map((skill) => {
            const isSelected = selectedSkills.includes(String(skill.id));
            const modifier = getModifier(skill.ability);
            const abilityShort = getAbilityShort(skill.ability);
            
            return (
              <SelectableCard
                key={skill.id}
                multiple
                selected={isSelected}
                showCheck={false}
                onClick={() => toggleSkill(skill.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSkill(skill.id)}
                    className="pointer-events-none"
                  />
                  <div>
                    <Label className="font-medium text-ink-strong cursor-pointer">
                      {skill.name_it}
                    </Label>
                    <p className="text-xs text-ink-muted">
                      {abilityShort} ({modifier >= 0 ? `+${modifier}` : modifier})
                    </p>
                    {skill.description && (
                      <p className="text-xs text-ink-muted/80 mt-1 line-clamp-1">
                        {skill.description}
                      </p>
                    )}
                  </div>
                </div>
              </SelectableCard>
            );
          })}
        </div>
      </AncientCardContainer>

      {/* Info box */}
      <Note title="Come funziona?">
        Quando effettui una prova di abilità, aggiungi il modificatore dell&apos;abilità
        corrispondente. Se sei addestrato, aggiungi anche il bonus di competenza (+2 al 1° livello).
      </Note>
    </WizardStep>
  );
}