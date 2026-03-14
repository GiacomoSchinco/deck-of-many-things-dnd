/** Returns the ability modifier for a given score (e.g. 16 → +3) */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Returns the proficiency bonus for a given character level */
export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}
