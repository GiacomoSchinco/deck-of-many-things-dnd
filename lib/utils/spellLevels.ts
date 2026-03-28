// lib/utils/spellLevels.ts
//
// Returns the array of spell levels a class can access at a given character level.
// Level 0 = cantrips (always included when the class has spellcasting).
// Used to filter the spell list so a player cannot learn spells they can't yet cast.

const FULL_CASTERS   = ['wizard', 'sorcerer', 'bard', 'cleric', 'druid'];
const HALF_CASTERS   = ['paladin', 'ranger'];
const THIRD_CASTERS  = ['fighter', 'rogue']; // Eldritch Knight / Arcane Trickster
const PACT_CASTERS   = ['warlock'];

/**
 * Full caster spell slot progression (PHB table).
 * Index = character level (1-based), value = max spell level available.
 */
const FULL_CASTER_MAX: number[] = [
  0, // placeholder for index 0
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
  6, 6, 7, 7, 8, 8, 9, 9, 9, 9,
];

/**
 * Half caster spell slot progression.
 * Paladin/Ranger get their first slots at level 2.
 */
const HALF_CASTER_MAX: number[] = [
  0,
  0, 1, 1, 1, 2, 2, 2, 2, 3, 3,
  3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
];

/**
 * Third caster (Eldritch Knight / Arcane Trickster).
 * First spells at level 3.
 */
const THIRD_CASTER_MAX: number[] = [
  0,
  0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
  2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
];

/**
 * Warlock pact magic slot level (equals the max spell level they can cast).
 */
const WARLOCK_PACT_MAX: number[] = [
  0,
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];

/**
 * Returns all spell levels [0..maxLevel] that a class can access at a given
 * character level. Returns [0] (cantrips only) for non-casters or before
 * they unlock their first slots.
 *
 * @param className - English, lowercase class name (e.g. 'wizard')
 * @param characterLevel - 1-20
 */
export function getAvailableSpellLevels(
  className: string,
  characterLevel: number,
): number[] {
  const clamp = Math.min(Math.max(characterLevel, 1), 20);

  let maxLevel = 0;

  if (FULL_CASTERS.includes(className)) {
    maxLevel = FULL_CASTER_MAX[clamp];
  } else if (PACT_CASTERS.includes(className)) {
    maxLevel = WARLOCK_PACT_MAX[clamp];
  } else if (HALF_CASTERS.includes(className)) {
    maxLevel = HALF_CASTER_MAX[clamp];
  } else if (THIRD_CASTERS.includes(className)) {
    maxLevel = THIRD_CASTER_MAX[clamp];
  }

  // Build [0, 1, 2, ... maxLevel]
  return Array.from({ length: maxLevel + 1 }, (_, i) => i);
}
