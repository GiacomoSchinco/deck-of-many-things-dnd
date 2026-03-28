export interface CreationAbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CreationData {
  name: string;
  playerName: string;
  alignment: string;
  background: string;

  raceId: number | null;
  classId: number | null;
  campaignId: string | null;

  abilityScores: CreationAbilityScores | null;
  skills?: string[];
  spells?: string[];        // spell IDs scelti (cantrip + incantesimi)
  equipment?: Array<Record<string, unknown>>;
}

export type CreationStep =
  | 'basic-info'
  | 'race'
  | 'class'
  | 'campaign'
  | 'abilities'
  | 'skills'
  | 'equipment'
  | 'spells'
  | 'review';

export default CreationData;
