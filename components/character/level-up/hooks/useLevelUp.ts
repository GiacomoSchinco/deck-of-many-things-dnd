// components/character/level-up/hooks/useLevelUp.ts
'use client';

import { useState, useMemo } from 'react';
import { useCharacter } from '@/hooks/queries/useCharacter';
import { getLevelUpSpellChanges, getSpellProgression } from '@/lib/rules/spellcasting';
import { useUpdateCharacter } from '@/hooks/mutations/useCharacterMutations';
import { useAddCharacterSpells, useRemoveCharacterSpells, useUpdateSpellSlots } from '@/hooks/mutations/useCharacterSpellMutations';
import LevelUpHPStep from '../steps/LevelUpHPStep';
import LevelUpASIStep from '../steps/LevelUpASIStep';
import LevelUpSpellsStep from '../steps/LevelUpSpellsStep';
import LevelUpFeaturesStep from '../steps/LevelUpFeaturesStep';
import LevelUpSummaryStep from '../steps/LevelUpSummaryStep';

const hitDiceValues: Record<string, number> = {
  d6: 4, d8: 5, d10: 6, d12: 7,
};

export type LevelUpData = {
  hpGain: number;
  hpMethod: string;
  rolledValue: number | null;
  asiType?: 'increase' | 'feat';
  increaseType?: 'single' | 'double';
  selectedStat?: string;
  secondStat?: string;
  changes?: Record<string, number>;
  newSpells: string[];
  swapFrom?: string; // known_id dell'incantesimo da rimuovere
  swapTo?: string;   // spell_id del sostituto
};

interface UseLevelUpOptions {
  characterId: string;
  currentLevel: number;
  onComplete: () => void;
}

export function useLevelUp({ characterId, currentLevel, onComplete }: UseLevelUpOptions) {
  const newLevel = currentLevel + 1;
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [levelUpData, setLevelUpData] = useState<LevelUpData>({
    hpGain: 0,
    hpMethod: 'average',
    rolledValue: null,
    newSpells: [],
  });

  const { data: character, isLoading } = useCharacter(characterId);
  const updateCharacter = useUpdateCharacter(characterId);
  const addSpells = useAddCharacterSpells();
  const removeSpells = useRemoveCharacterSpells();
  const updateSpellSlots = useUpdateSpellSlots();

  // Calcola cosa cambia al nuovo livello
  const changes = useMemo(() => {
    if (!character) return null;

    const hitDiceType = character.hit_dice_type || 'd8';
    const hitDiceMax = hitDiceValues[hitDiceType] || 5;
    const conMod = Math.floor((character.ability_scores?.constitution - 10) / 2) || 0;
    const averageHpGain = hitDiceMax + conMod;

    // ASI (livelli 4, 8, 12, 16, 19)
    const hasASI = [4, 8, 12, 16, 19].includes(newLevel);

    // Spell changes
    const className = character.classes?.name?.toLowerCase();
    const intMod = Math.floor((character.ability_scores?.intelligence - 10) / 2) || 0;
    const wisMod = Math.floor((character.ability_scores?.wisdom - 10) / 2) || 0;
    const chaMod = Math.floor((character.ability_scores?.charisma - 10) / 2) || 0;

    let abilityMod = 0;
    if (className === 'wizard') abilityMod = intMod;
    else if (className === 'cleric' || className === 'druid') abilityMod = wisMod;
    else if (className === 'paladin') abilityMod = chaMod;

    const spellChanges = getLevelUpSpellChanges(className, currentLevel, newLevel, abilityMod);
    const newSpellProgression = getSpellProgression(className, newLevel, abilityMod);

    // Features (da implementare con tabella)
    const newFeatures: { name: string; description: string; level: number; icon?: string }[] = [];

    return {
      averageHpGain,
      hitDiceType,
      conMod,
      hasASI,
      spellChanges,
      newSpellProgression,
      newFeatures,
    };
  }, [character, currentLevel, newLevel]);

  // Determina gli step da mostrare in base alle variazioni del livello
  const steps = useMemo(() => {
    if (!changes) return [];
    return [
      { id: 'hp',       label: 'Punti Ferita',          component: LevelUpHPStep,       condition: true },
      { id: 'asi',      label: 'Aumento Caratteristiche', component: LevelUpASIStep,      condition: changes.hasASI },
      { id: 'spells',   label: 'Incantesimi',            component: LevelUpSpellsStep,   condition:
          (changes.spellChanges.newCantrips ?? 0) > 0 ||
          (changes.spellChanges.newSpellsKnown ?? 0) > 0 ||
          Object.keys(changes.spellChanges.newSpellSlots ?? {}).length > 0 ||
          !!changes.spellChanges.newPactMagic,
      },
      { id: 'features', label: 'Nuove Abilità',          component: LevelUpFeaturesStep, condition: changes.newFeatures.length > 0 },
      { id: 'summary',  label: 'Riepilogo',              component: LevelUpSummaryStep,  condition: true },
    ].filter(s => s.condition);
  }, [changes]);

  const progress = steps.length > 0 ? ((step + 1) / steps.length) * 100 : 0;
  const currentStep = steps[step] ?? steps[steps.length - 1];

  const handleNext = (data: Partial<LevelUpData> & Record<string, unknown>) => {
    setLevelUpData(prev => ({ ...prev, ...data }));
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      saveLevelUp();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const saveLevelUp = async () => {
    if (!character || !changes) return;
    setIsSaving(true);
    try {
      // 1. Aggiorna livello, HP (e ability scores se ASI)
      const newMaxHp = (character.combat_stats?.max_hp || 0) + levelUpData.hpGain;
      const updateBody: Record<string, unknown> = {
        level: newLevel,
        combatStats: {
          max_hp: newMaxHp,
          current_hp: (character.combat_stats?.current_hp ?? 0) + levelUpData.hpGain,
        },
      };

      if (levelUpData.asiType === 'increase' && levelUpData.changes) {
        updateBody.abilityScores = {
          ...(character.ability_scores || {}),
          ...levelUpData.changes,
        };
      }
      await updateCharacter.mutateAsync(updateBody);

      // 2. Nuovi incantesimi (+ sostituto se swap)
      const spellsToAdd = [...levelUpData.newSpells];
      if (levelUpData.swapTo) spellsToAdd.push(levelUpData.swapTo);
      if (spellsToAdd.length > 0) {
        await addSpells.mutateAsync({ characterId, spellIds: spellsToAdd.map(Number) });
      }

      // 2b. Rimozione incantesimo sostituito
      if (levelUpData.swapFrom) {
        await removeSpells.mutateAsync({ characterId, knownIds: [levelUpData.swapFrom] });
      }

      // 3. Aggiorna spell slots (upsert total_slots, preserva used_slots)
      const totalSpellSlots = changes.spellChanges?.totalSpellSlots;
      if (totalSpellSlots && Object.keys(totalSpellSlots).length > 0) {
        const existingSlots: Array<{ spell_level: number; total_slots: number; used_slots: number }> =
          character.spell_slots || [];
        const slots = Object.entries(totalSpellSlots)
          .filter(([, total]) => (total as number) > 0)
          .map(([lvl, total]) => {
            const spellLevel = Number(lvl);
            const existing = existingSlots.find(s => s.spell_level === spellLevel);
            return {
              spell_level: spellLevel,
              total_slots: total as number,
              used_slots: Math.min(existing?.used_slots ?? 0, total as number),
            };
          });
        if (slots.length > 0) {
          await updateSpellSlots.mutateAsync({ characterId, slots });
        }
      }

      onComplete();
    } catch (err) {
      console.error('Errore durante il level up:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    character,
    isLoading,
    changes,
    steps,
    step,
    currentStep,
    progress,
    levelUpData,
    isSaving,
    handleNext,
    handleBack,
  };
}
