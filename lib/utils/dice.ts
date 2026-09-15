/** Tira un singolo dado con il numero di facce indicato (es. roll(20) per d20) */
export function roll(faces: number): number {
  return Math.floor(Math.random() * faces) + 1;
}

/** Tira più dadi e restituisce la loro somma (es. rollDice(4, 6) per 4d6) */
export function rollDice(count: number, faces: number): number {
  return Array.from({ length: count }, () => roll(faces)).reduce((a, b) => a + b, 0);
}

/** Tira 4d6 e scarta il dado più basso (metodo standard per i punteggi caratteristica) */
export function rollAbilityScore(): number {
  const rolls = Array.from({ length: 4 }, () => roll(6)).sort((a, b) => a - b);
  return rolls.slice(1).reduce((a, b) => a + b, 0);
}
