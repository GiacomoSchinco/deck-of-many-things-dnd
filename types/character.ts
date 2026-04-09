// types/character.ts

// ===========================================
// ABILITÀ E CARATTERISTICHE BASE
// ===========================================

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export type ProficiencyType = 'none' | 'proficient' | 'expertise' | 'half';

export interface SkillProficiencies {
  acrobatics: ProficiencyType;
  animalHandling: ProficiencyType;
  arcana: ProficiencyType;
  athletics: ProficiencyType;
  deception: ProficiencyType;
  history: ProficiencyType;
  insight: ProficiencyType;
  intimidation: ProficiencyType;
  investigation: ProficiencyType;
  medicine: ProficiencyType;
  nature: ProficiencyType;
  perception: ProficiencyType;
  performance: ProficiencyType;
  persuasion: ProficiencyType;
  religion: ProficiencyType;
  sleightOfHand: ProficiencyType;
  stealth: ProficiencyType;
  survival: ProficiencyType;
}

export interface SavingThrows {
  strength: boolean;
  dexterity: boolean;
  constitution: boolean;
  intelligence: boolean;
  wisdom: boolean;
  charisma: boolean;
}

// ===========================================
// COMBATTIMENTO
// ===========================================

export interface CombatStats {
  maxHp: number;
  currentHp: number;
  tempHp: number;
  hitDiceType: 'd6' | 'd8' | 'd10' | 'd12';
  hitDiceTotal: number;
  hitDiceUsed: number;
  armorClass: number;
  initiative: number;
  speed: number;
  inspiration: boolean;
  proficiencyBonus: number;
  deathSaves?: {
    successes: number;
    failures: number;
  };
}

// ===========================================
// INVENTARIO
// ===========================================

export interface BaseItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  equipped: boolean;
  description?: string;
  cost?: number;
  costUnit?: 'po' | 'pa' | 'pr' | 'pe' | 'mo';
  notes?: string;
}

export interface WeaponProperties {
  itemType: 'weapon';
  damageDice: string;
  damageType: 'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning' | 'necrotic' | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'slashing' | 'thunder';
  range?: {
    normal: number;
    long?: number;
  };
  properties: ('finesse' | 'heavy' | 'light' | 'loading' | 'reach' | 'special' | 'thrown' | 'two-handed' | 'versatile')[];
  versatileDamage?: string;
  magicBonus?: number;
  requiresAttunement?: boolean;
  proficiency?: boolean;
}

export interface ArmorProperties {
  itemType: 'armor';
  armorClass: number;
  type: 'light' | 'medium' | 'heavy' | 'shield';
  stealthDisadvantage?: boolean;
  strengthRequirement?: number;
  magicBonus?: number;
  requiresAttunement?: boolean;
  don?: number;
  doff?: number;
  proficiency?: boolean;
  addsDexModifier?: boolean;
  maxDexBonus?: number;
}

export interface MagicItemProperties {
  itemType: 'magic';
  magicBonus?: number;
  requiresAttunement: boolean;
  spellEffects?: {
    spellName: string;
    uses?: number;
    recharge?: 'dawn' | 'dusk' | 'shortRest' | 'longRest';
  }[];
  charges?: {
    current: number;
    max: number;
    recharge: 'dawn' | 'dusk' | 'shortRest' | 'longRest' | 'none';
  };
  curse?: {
    name: string;
    description: string;
    isKnown: boolean;
  };
}

export interface ConsumableProperties {
  itemType: 'consumable';
  effect: string;
  duration?: string;
  spellName?: string;
  spellLevel?: number;
  usesRemaining?: number;
  usesMax?: number;
}

export interface AmmunitionProperties {
  itemType: 'ammunition';
  ammunitionType: 'arrow' | 'bolt' | 'bullet' | 'needle';
  damageBonus?: number;
  magicBonus?: number;
  quantity: number;
}

export interface ToolProperties {
  itemType: 'tool';
  toolType: string;
  proficiency?: boolean;
  advantage?: boolean;
}

export interface GearProperties {
  itemType: 'gear';
  container?: {
    capacity: number;
    items: string[];
  };
}

export type ItemProperties = 
  | WeaponProperties
  | ArmorProperties
  | MagicItemProperties
  | ConsumableProperties
  | AmmunitionProperties
  | ToolProperties
  | GearProperties;

export interface InventoryItem extends BaseItem {
  type: 'weapon' | 'armor' | 'gear' | 'magic' | 'consumable' | 'ammunition' | 'tool';
  properties: ItemProperties;
}

export interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

// ===========================================
// INCANTESIMI
// ===========================================
// I tipi canonici vivono in types/spell.ts
export type { Spell, SpellSlots } from './spell';

// ===========================================
// CARATTERISTICHE E TALENTI
// ===========================================

export interface Feature {
  id: string;
  name: string;
  description: string;
  source: 'race' | 'class' | 'feat' | 'item' | 'background';
  levelTaken?: number;
  usesRemaining?: number;
  usesMax?: number;
  refreshOn?: 'shortRest' | 'longRest' | 'dawn' | 'dusk';
  prerequisites?: string;
  children?: Feature[];
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisites?: string;
  benefits: string[];
  asi?: Partial<AbilityScores>;
}

// ===========================================
// PROGRESSIONE
// ===========================================

export interface ClassFeatures {
  class: string;
  subclass?: string;
  level: number;
  features: Feature[];
  spellSlotsProgression?: Record<number, number[]>; // livello: [slot1, slot2, ...]
}

// ===========================================
// PERSONAGGIO COMPLETO
// ===========================================

export interface Character {
  // Metadata
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  // Info base
  name: string;
  playerName?: string;
  campaign?: string;
  
  // D&D specific
  race: string;
  raceTraits?: Feature[];
  
  class: string;
  subclass?: string;
  classFeatures?: Feature[];
  
  level: number;
  experience: number;
  experiencePoints?: number; // per chi usa XP invece di milestone
  
  background?: string;
  backgroundFeature?: Feature;
  
  alignment?: string;
  
  // Stats
  abilityScores: AbilityScores;
  skillProficiencies: SkillProficiencies;
  savingThrows: SavingThrows;
  combatStats: CombatStats;
  
  // Inventory
  inventory: InventoryItem[];
  currency: Currency;
  carryingCapacity?: {
    max: number;
    current: number;
    encumbered?: boolean;
    heavilyEncumbered?: boolean;
  };
  
  // Spells
  spells?: Spell[];
  spellSlots?: SpellSlots;
  spellcastingAbility?: 'intelligence' | 'wisdom' | 'charisma';
  spellSaveDC?: number;
  spellAttackBonus?: number;
  spellsKnown?: number;
  cantripsKnown?: number;
  preparedSpells?: number;
  
  // Features
  features: Feature[];
  feats?: Feat[];
  
  // Roleplay
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  appearance?: string;
  backstory?: string;
  allies?: {
    name: string;
    description: string;
  }[];
  enemies?: {
    name: string;
    description: string;
  }[];
  organizations?: string[];
  
  // Note
  notes?: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    category?: 'quest' | 'lore' | 'personal' | 'party';
  }[];
  
  // Party
  partyId?: string;
  partyRole?: string;
  
  // Progressione
  classProgression: ClassFeatures[];
  featsTaken?: {
    feat: Feat;
    level: number;
  }[];
  
  // Utility
  proficiencyBonus: number;
  inspiration: boolean;
  passivePerception: number;
  passiveInsight: number;
  passiveInvestigation: number;
}