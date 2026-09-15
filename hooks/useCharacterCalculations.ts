// hooks/useCharacterCalculations.ts
import { useMemo } from 'react';
import { useRace } from '@/hooks/queries/useRaces';
import { useClass } from '@/hooks/queries/useClasses';
import { calculateModifier } from '@/lib/calculations/abilityModifiers';
import type { AbilityScores } from '@/types/character';

// PRNG deterministico (mulberry32) — stesso seed → stessi risultati, completamente puro
function makeSeededRandom(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useCharacterCalculations(
  raceId: number | null, 
  classId: number | null, 
  abilityScores: AbilityScores | null,
  level: number,
  rollHp: boolean = true,
  seed: number = 0,
) {
  const { data: raceData, isLoading: raceLoading } = useRace(raceId);
  const { data: classData, isLoading: classLoading } = useClass(classId);

  // 🟢 useMemo ricalcola SOLO quando cambiano le dipendenze
  const calculations = useMemo(() => {
    // Dati non ancora disponibili (fetch in corso)
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

    // Calcoli derivati dai punteggi effettivi
    const conMod = calculateModifier(effectiveScores.constitution);
    const dexMod = calculateModifier(effectiveScores.dexterity);

    const hitDieMap: Record<string, number> = {
      'd6': 6, 'd8': 8, 'd10': 10, 'd12': 12
    };
    const hitDieValue = hitDieMap[classData?.hit_die || 'd8'] || 8;

    // HP: 1° livello = dado vita + modificatore CON
    // Livelli successivi: tiro dado (rollHp=true) oppure media fissa
    const lvl = Math.max(1, Math.trunc(level || 1));
    let max_hp = hitDieValue + conMod;
    if (lvl > 1) {
      if (rollHp) {
        const rand = makeSeededRandom(seed);
        let total = max_hp;
        for (let i = 2; i <= lvl; i++) {
          const roll = Math.floor(rand() * hitDieValue) + 1;
          total += roll + conMod;
        }
        max_hp = Math.max(1, total);
      } else {
        const perLevelHpAvg = (hitDieValue / 2) + 0.5 + conMod; // formula media: (N+1)/2 + modCOS
        max_hp = Math.max(1, Math.floor((hitDieValue + conMod) + (lvl - 1) * perLevelHpAvg));
      }
    }

    // I dadi vita totali corrispondono al livello del personaggio
    const hit_dice_total = Math.max(1, lvl);

    // Bonus competenza: +2 livelli 1-4, +3 livelli 5-8, ecc.
    const proficiencyBonus = Math.floor((lvl - 1) / 4) + 2;

    return {
      combatStats: {
        max_hp: max_hp,
        current_hp: max_hp,
        temp_hp: 0,
        hit_dice_type: classData.hit_die,
        hit_dice_total: hit_dice_total,
        hit_dice_used: 0,
        armor_class: 10 + dexMod,
        initiative_bonus: dexMod,
        speed: raceData?.speed || 30,
        inspiration: false,
      },
      proficiencyBonus,
      raceData,
      classData
    };
  }, [raceData, classData, abilityScores, level, rollHp, seed]); // 🔥 dipendenze: ricalcola solo se cambia uno di questi

  return {
    calculations,
    isLoading: raceLoading || classLoading,
    isReady: !!calculations
  };
}