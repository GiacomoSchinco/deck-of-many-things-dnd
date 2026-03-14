// TypeScript interfaces per il personaggio D&D 5e

export type AbilityScore = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export interface AbilityScores {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  subclass?: string;
  background: string;
  level: number;
  experiencePoints: number;
  abilityScores: AbilityScores;
  proficiencies: string[];
  equipment: EquipmentItem[];
  spells?: Spell[];
  hitPoints: {
    max: number;
    current: number;
    temporary: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  description?: string;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  prepared?: boolean;
}
