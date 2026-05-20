// lib/utils/spellLevels.ts
//
// Restituisce l'array dei livelli di incantesimo accessibili a una classe per un dato livello personaggio.
// Livello 0 = trucchetti (sempre inclusi se la classe ha capacità di lancio incantesimi).
// Usato per filtrare la lista incantesimi in modo che un giocatore non possa imparare spell troppo avanzate.

const FULL_CASTERS   = ['wizard', 'sorcerer', 'bard', 'cleric', 'druid'];
const HALF_CASTERS   = ['paladin', 'ranger'];
const THIRD_CASTERS  = ['fighter', 'rogue']; // Eldritch Knight / Arcane Trickster (un terzo dei livelli)
const PACT_CASTERS   = ['warlock'];

/**
 * Progressione slot incantesimo per lanciatori completi (tabella PHB).
 * Indice = livello personaggio (base 1), valore = livello massimo incantesimo disponibile.
 */
const FULL_CASTER_MAX: number[] = [
  0, // segnaposto per indice 0
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
  6, 6, 7, 7, 8, 8, 9, 9, 9, 9,
];

/**
 * Progressione slot incantesimo per lanciatori metà (half caster).
 * Paladino/Ranger ottengono i primi slot al livello 2.
 */
const HALF_CASTER_MAX: number[] = [
  0,
  0, 1, 1, 1, 2, 2, 2, 2, 3, 3,
  3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
];

/**
 * Lanciatori a un terzo (Eldritch Knight / Arcane Trickster).
 * I primi incantesimi sbloccano al livello 3.
 */
const THIRD_CASTER_MAX: number[] = [
  0,
  0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
  2, 2, 3, 3, 3, 3, 3, 3, 3, 3,
];

/**
 * Livello slot patto del Warlock (corrisponde al livello massimo incantesimo lanciabile).
 */
const WARLOCK_PACT_MAX: number[] = [
  0,
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];

/**
 * Restituisce tutti i livelli incantesimo [0..maxLevel] accessibili a una classe per un dato
 * livello personaggio. Restituisce [0] (solo trucchetti) per non-lanciatori o prima che
 * sblocchino i loro slot.
 *
 * @param className - nome classe in inglese, minuscolo (es. 'wizard')
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

  // Costruisce [0, 1, 2, ... maxLevel]
  return Array.from({ length: maxLevel + 1 }, (_, i) => i);
}
