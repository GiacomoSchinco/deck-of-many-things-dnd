// lib/calculations/abilityModifiers.ts

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function calculateProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

export function calculateSkillBonus(
  abilityModifier: number,
  proficiencyType: 'none' | 'proficient' | 'expertise' | 'half',
  proficiencyBonus: number
): number {
  switch (proficiencyType) {
    case 'proficient':
      return abilityModifier + proficiencyBonus;
    case 'expertise':
      return abilityModifier + (proficiencyBonus * 2);
    case 'half':
      return abilityModifier + Math.floor(proficiencyBonus / 2);
    case 'none':
    default:
      return abilityModifier;
  }
}

export function calculateSpellSaveDC(
  proficiencyBonus: number,
  spellcastingAbilityModifier: number
): number {
  return 8 + proficiencyBonus + spellcastingAbilityModifier;
}

export function calculateSpellAttackBonus(
  proficiencyBonus: number,
  spellcastingAbilityModifier: number
): number {
  return proficiencyBonus + spellcastingAbilityModifier;
}