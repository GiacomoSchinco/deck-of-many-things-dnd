// lib/rules/spellcasting.ts

export type SpellCastingClass =
  | 'wizard'
  | 'sorcerer'
  | 'bard'
  | 'cleric'
  | 'druid'
  | 'paladin'
  | 'ranger'
  | 'warlock';

export interface SpellProgression {
  /** Numero di trucchetti (cantrips) conosciuti */
  cantrips: number;
  /**
   * Numero di incantesimi conosciuti (spells known).
   * - null significa che la classe prepara gli incantesimi (non li conosce fissi).
   * - Per il mago, null indica che prepara, ma il grimorio ha una dimensione iniziale
   */
  spellsKnown: number | null;
  /** Numero di incantesimi preparabili (solo per classi che preparano) */
  spellsPreparable?: number;
  /** Solo per il mago: numero di incantesimi nel grimorio al momento della creazione (sempre 6 a livello 1) */
  wizardSpellbookSize?: number;
  /** Per classi che preparano: caratteristica usata per calcolare quanti preparare */
  preparedModifier?: 'int' | 'wis' | 'cha';
  /** Slot incantesimi normali (per tutte le classi tranne warlock). La chiave è il livello dell'incantesimo (1-9). */
  spellSlots: Record<number, number>;
  /** Solo per warlock: informazioni sul Pact Magic */
  pactMagic?: {
    slots: number;      // numero di slot (es. 1,2,3,4)
    level: number;      // livello dello slot (1-5)
    mysticArcanum?: number[]; // livelli (6-9) per i misteri arcani
  };
}

// --------------------------------------------------------------
// 1. PROGRESSIONE TRUCCHETTI (cantrips)
// --------------------------------------------------------------
const cantripsProgression: Record<SpellCastingClass, Record<number, number>> = {
  wizard:   {1:3,2:3,3:3,4:4,5:4,6:4,7:4,8:4,9:4,10:5,11:5,12:5,13:5,14:5,15:5,16:5,17:5,18:5,19:5,20:5},
  sorcerer: {1:4,2:4,3:4,4:5,5:5,6:5,7:5,8:5,9:5,10:6,11:6,12:6,13:6,14:6,15:6,16:6,17:6,18:6,19:6,20:6},
  bard:     {1:2,2:2,3:2,4:3,5:3,6:3,7:3,8:3,9:3,10:4,11:4,12:4,13:4,14:4,15:4,16:4,17:4,18:4,19:4,20:4},
  cleric:   {1:3,2:3,3:3,4:4,5:4,6:4,7:4,8:4,9:4,10:5,11:5,12:5,13:5,14:5,15:5,16:5,17:5,18:5,19:5,20:5},
  druid:    {1:2,2:2,3:2,4:3,5:3,6:3,7:3,8:3,9:3,10:4,11:4,12:4,13:4,14:4,15:4,16:4,17:4,18:4,19:4,20:4},
  paladin:  {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0},
  ranger:   {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0},
  warlock:  {1:2,2:2,3:2,4:3,5:3,6:3,7:3,8:3,9:3,10:4,11:4,12:4,13:4,14:4,15:4,16:4,17:4,18:4,19:4,20:4},
};

// --------------------------------------------------------------
// 2. PROGRESSIONE INCANTESIMI CONOSCIUTI (spells known)
//    Le classi che preparano (wizard, cleric, druid, paladin) hanno oggetti vuoti
// --------------------------------------------------------------
const spellsKnownProgression: Record<SpellCastingClass, Record<number, number>> = {
  // Classi che preparano (non hanno spells known fissi)
  wizard: {},
  cleric: {},
  druid: {},
  paladin: {},
  // Classi che conoscono
  bard: {
    1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,
    11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,19:15,20:15,
  },
  sorcerer: {
    1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,
    11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,19:15,20:15,
  },
  ranger: {
    1:0,2:2,3:3,4:3,5:4,6:4,7:5,8:5,9:6,10:6,
    11:7,12:7,13:8,14:8,15:9,16:9,17:10,18:10,19:11,20:11,
  },
  warlock: {
    1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:10,
    11:11,12:11,13:12,14:12,15:13,16:13,17:14,18:14,19:15,20:15,
  },
};

// --------------------------------------------------------------
// 3. SLOT INCANTESIMI
// --------------------------------------------------------------
const fullCasterSlots: Record<number, Record<number, number>> = {
  1: {1:2},
  2: {1:3},
  3: {1:4,2:2},
  4: {1:4,2:3},
  5: {1:4,2:3,3:2},
  6: {1:4,2:3,3:3},
  7: {1:4,2:3,3:3,4:1},
  8: {1:4,2:3,3:3,4:2},
  9: {1:4,2:3,3:3,4:3,5:1},
  10:{1:4,2:3,3:3,4:3,5:2},
  11:{1:4,2:3,3:3,4:3,5:2,6:1},
  12:{1:4,2:3,3:3,4:3,5:2,6:1},
  13:{1:4,2:3,3:3,4:3,5:2,6:1,7:1},
  14:{1:4,2:3,3:3,4:3,5:2,6:1,7:1},
  15:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1},
  16:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1},
  17:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1,9:1},
  18:{1:4,2:3,3:3,4:3,5:2,6:1,7:1,8:1,9:1},
  19:{1:4,2:3,3:3,4:3,5:3,6:2,7:1,8:1,9:1},
  20:{1:4,2:3,3:3,4:3,5:3,6:2,7:2,8:1,9:1},
};

const halfCasterSlots: Record<number, Record<number, number>> = {
  1: {},
  2: {1:2},
  3: {1:3},
  4: {1:3},
  5: {1:4,2:2},
  6: {1:4,2:2},
  7: {1:4,2:3},
  8: {1:4,2:3},
  9: {1:4,2:3,3:2},
  10:{1:4,2:3,3:2},
  11:{1:4,2:3,3:3},
  12:{1:4,2:3,3:3},
  13:{1:4,2:3,3:3,4:1},
  14:{1:4,2:3,3:3,4:1},
  15:{1:4,2:3,3:3,4:2},
  16:{1:4,2:3,3:3,4:2},
  17:{1:4,2:3,3:3,4:3},
  18:{1:4,2:3,3:3,4:3},
  19:{1:4,2:3,3:3,4:3,5:1},
  20:{1:4,2:3,3:3,4:3,5:1},
};

// Classi che hanno magia
const CASTER_CLASSES = new Set<string>([
  'wizard', 'sorcerer', 'bard', 'cleric', 'druid', 'paladin', 'ranger', 'warlock',
]);

// --------------------------------------------------------------
// 4. FUNZIONE PRINCIPALE
// --------------------------------------------------------------
export function getSpellProgression(
  className: string,
  level: number,
  abilityModifier: number = 0
): SpellProgression {
  // Classi senza magia (guerriero, barbaro, monaco, ecc.) → progressione vuota
  if (!CASTER_CLASSES.has(className)) {
    return { cantrips: 0, spellsKnown: null, spellSlots: {} };
  }
  const cls = className as SpellCastingClass;
  const progression: SpellProgression = {
    cantrips: 0,
    spellsKnown: null,
    spellSlots: {},
  };

  // 1. Cantrips
  progression.cantrips = cantripsProgression[cls]?.[level] ?? 0;

  // 2. Spells known / preparazione
  if (cls === 'wizard') {
    progression.spellsKnown = null;
    progression.wizardSpellbookSize = 6;
    progression.preparedModifier = 'int';
    progression.spellsPreparable = Math.max(1, level + abilityModifier);
    
  } else if (cls === 'cleric' || cls === 'druid') {
    progression.spellsKnown = null;
    progression.preparedModifier = 'wis';
    progression.spellsPreparable = Math.max(1, level + abilityModifier);
    
  } else if (cls === 'paladin') {
    progression.spellsKnown = null;
    progression.preparedModifier = 'cha';
    progression.spellsPreparable = Math.max(1, Math.floor(level / 2) + abilityModifier);
    
  } else if (spellsKnownProgression[cls]) {
    progression.spellsKnown = spellsKnownProgression[cls][level] ?? 0;
  }

  // 3. Slot incantesimi
  if (cls === 'warlock') {
    let pactSlots = 1;
    let pactLevel = 1;
    if (level >= 1 && level <= 2) { pactSlots = 1; pactLevel = 1; }
    else if (level <= 4) { pactSlots = 2; pactLevel = 2; }
    else if (level <= 6) { pactSlots = 2; pactLevel = 3; }
    else if (level <= 8) { pactSlots = 2; pactLevel = 4; }
    else if (level <= 10) { pactSlots = 2; pactLevel = 5; }
    else if (level <= 16) { pactSlots = 3; pactLevel = 5; }
    else { pactSlots = 4; pactLevel = 5; }

    progression.pactMagic = { slots: pactSlots, level: pactLevel };
    if (level >= 11) progression.pactMagic.mysticArcanum = [6];
    if (level >= 13) progression.pactMagic.mysticArcanum!.push(7);
    if (level >= 15) progression.pactMagic.mysticArcanum!.push(8);
    if (level >= 17) progression.pactMagic.mysticArcanum!.push(9);
  } else {
    const isFullCaster = ['wizard','sorcerer','bard','cleric','druid'].includes(cls);
    const slotsTable = isFullCaster ? fullCasterSlots : halfCasterSlots;
    progression.spellSlots = slotsTable[level] ?? {};
  }

  return progression;
}

// --------------------------------------------------------------
// 5. FUNZIONE PER IL LEVEL UP
// --------------------------------------------------------------
export function getLevelUpSpellChanges(
  className: string,
  oldLevel: number,
  newLevel: number,
  abilityModifier: number = 0
): {
  newCantrips: number;
  newSpellsKnown: number;
  newSpellsPreparable: number;
  /** Slot GUADAGNATI al nuovo livello (delta ≥ 1 per livello). Usarli per la visualizzazione. */
  newSpellSlots: Record<number, number>;
  /** Totale slot al nuovo livello (tutti i livelli). Usarli per l'upsert nel DB. */
  totalSpellSlots: Record<number, number>;
  newPactMagic?: SpellProgression['pactMagic'];
} {
  const oldProg = getSpellProgression(className, oldLevel, abilityModifier);
  const newProg = getSpellProgression(className, newLevel, abilityModifier);

  // Solo i livelli in cui il personaggio guadagna slot aggiuntivi
  const newSpellSlots: Record<number, number> = {};
  for (const [lvl, count] of Object.entries(newProg.spellSlots)) {
    const delta = (count as number) - (oldProg.spellSlots[Number(lvl)] ?? 0);
    if (delta > 0) newSpellSlots[Number(lvl)] = delta;
  }

  return {
    newCantrips: newProg.cantrips - oldProg.cantrips,
    newSpellsKnown: (newProg.spellsKnown ?? 0) - (oldProg.spellsKnown ?? 0),
    newSpellsPreparable: (newProg.spellsPreparable ?? 0) - (oldProg.spellsPreparable ?? 0),
    newSpellSlots,
    totalSpellSlots: newProg.spellSlots,
    newPactMagic: newProg.pactMagic,
  };
}