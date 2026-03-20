// components/character/creation-wizard/steps/SkillsStep.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClass } from '@/hooks/queries/useClasses';
import { useSkillList} from '@/hooks/queries/useSkills'; // ← usa useAllSkills
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { Loader2, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Skill } from '@/types/skill';

interface SkillsStepProps {
  classId: number;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  onConfirm: (selectedSkills: string[]) => void;
  onBack: () => void;
}

// Mappa per convertire ability in nome breve
const abilityShortNames: Record<string, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  constitution: 'COS',
  intelligence: 'INT',
  wisdom: 'SAG',
  charisma: 'CAR',
};

export function SkillsStep({ classId, abilityScores, onConfirm, onBack }: SkillsStepProps) {
  const { data: classData, isLoading: classLoading } = useClass(classId);
  const { data: allSkills, isLoading: skillsLoading } = useSkillList();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

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
    setSelectedSkills(prev => {
      const skillIdStr = String(skillId);
      if (prev.includes(skillIdStr)) {
        return prev.filter(id => id !== skillIdStr);
      } else {
        if (prev.length < maxChoices) {
          return [...prev, skillIdStr];
        }
        return prev;
      }
    });
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
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700 mx-auto mb-4" />
        <p className="text-amber-700">Caricamento competenze...</p>
      </div>
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">
          🎯 Competenze di Classe
        </h2>
        <p className="text-amber-700 text-sm">
          Scegli {maxChoices} competenze in cui essere addestrato
        </p>
        <p className="text-xs text-amber-500 mt-1">
          {selectedSkills.length}/{maxChoices} selezionate
        </p>
      </div>

      <AncientCardContainer className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSkills.map((skill) => {
            const isSelected = selectedSkills.includes(String(skill.id));
            const modifier = getModifier(skill.ability);
            const abilityShort = abilityShortNames[skill.ability] || skill.ability.slice(0,3).toUpperCase();
            
            return (
              <div
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border-2',
                  isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-amber-900/20 hover:border-amber-700 bg-parchment-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSkill(skill.id)}
                    className="pointer-events-none"
                  />
                  <div>
                    <Label className="font-medium text-amber-900 cursor-pointer">
                      {skill.name_it}
                    </Label>
                    <p className="text-xs text-amber-600">
                      {abilityShort} ({modifier >= 0 ? `+${modifier}` : modifier})
                    </p>
                    {skill.description && (
                      <p className="text-xs text-amber-500 mt-1 line-clamp-1">
                        {skill.description}
                      </p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </AncientCardContainer>

      {/* Info box */}
      <div className="bg-amber-100/50 p-4 rounded-lg">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold mb-1">Come funziona?</p>
            <p>
              Quando effettui una prova di abilità, aggiungi il modificatore dell&apos;abilità 
              corrispondente. Se sei addestrato, aggiungi anche il bonus di competenza (+2 al 1° livello).
            </p>
          </div>
        </div>
      </div>

      {/* Pulsanti navigazione */}
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
          disabled={selectedSkills.length !== maxChoices}
          className="bg-amber-700 hover:bg-amber-800 text-amber-50 disabled:opacity-50"
        >
          Conferma Competenze →
        </Button>
      </div>
    </div>
  );
}