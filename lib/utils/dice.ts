/** Rolls a single die with the given number of faces (e.g. roll(20) for d20) */
export function roll(faces: number): number {
  return Math.floor(Math.random() * faces) + 1;
}

/** Rolls multiple dice and returns their sum (e.g. rollDice(4, 6) for 4d6) */
export function rollDice(count: number, faces: number): number {
  return Array.from({ length: count }, () => roll(faces)).reduce((a, b) => a + b, 0);
}

/** Rolls 4d6 and drops the lowest die (standard ability score generation) */
export function rollAbilityScore(): number {
  const rolls = Array.from({ length: 4 }, () => roll(6)).sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0);
}
