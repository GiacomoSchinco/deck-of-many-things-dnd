// hooks/useCharacterCalculations.ts
import { useMemo } from 'react';
import { useRace } from '@/hooks/queries/useRaces';
import { useClass } from '@/hooks/queries/useClasses';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import type { AbilityScores } from '@/types/character';

export function useCharacterCalculations(
  raceId: number | null, 
  classId: number | null, 
  abilityScores: AbilityScores | null
) {
  const { data: raceData, isLoading: raceLoading } = useRace(raceId);
  const { data: classData, isLoading: classLoading } = useClass(classId);

  // 🟢 useMemo calcola SOLO quando cambiano i dati
  const calculations = useMemo(() => {
    // Se i dati non sono ancora pronti
    if (!raceData || !classData || !abilityScores) {
      return null;
    }

    // Applica i bonus razza ai punteggi base
    const raceBonuses: Record<string, number> = raceData?.ability_bonuses || {};
    const effectiveScores = {
      strength:     abilityScores.strength     + (raceBonuses['strength']     || 0),
      dexterity:    abilityScores.dexterity    + (raceBonuses['dexterity']    || 0),
      constitution: abilityScores.constitution + (raceBonuses['constitution'] || 0),
      intelligence: abilityScores.intelligence + (raceBonuses['intelligence'] || 0),
      wisdom:       abilityScores.wisdom       + (raceBonuses['wisdom']       || 0),
      charisma:     abilityScores.charisma     + (raceBonuses['charisma']     || 0),
    };

    // Calcoli (puramente derivati!)
    const conMod = calculateModifier(effectiveScores.constitution);
    const dexMod = calculateModifier(effectiveScores.dexterity);
    
    const hitDieMap: Record<string, number> = {
      'd6': 6, 'd8': 8, 'd10': 10, 'd12': 12
    };
    const hitDieValue = hitDieMap[classData?.hit_die || 'd8'] || 8;
    const hp = hitDieValue + conMod;

    return {
      combatStats: {
        max_hp: hp,
        current_hp: hp,
        temp_hp: 0,
        hit_dice_type: classData.hit_die,
        hit_dice_total: 1,
        hit_dice_used: 0,
        armor_class: 10 + dexMod,
        initiative_bonus: dexMod,
        speed: raceData?.speed || 30,
        inspiration: false,
      },
      proficiencyBonus: 2,
      raceData,
      classData
    };
  }, [raceData, classData, abilityScores]); // 🔥 Dipendenze

  return {
    calculations,
    isLoading: raceLoading || classLoading,
    isReady: !!calculations
  };
}