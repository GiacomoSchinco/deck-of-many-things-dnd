export interface ClassFeature {
  level: number;
  name: string;
  description: string;
}

export interface DndClass {
  id: number;
  name: string;
  description: string;
  hit_die: string;
  primary_ability: string[];
  saving_throws: string[];
  armor_proficiencies: string[];
  weapon_proficiencies: string[];
  tool_proficiencies?: string[];
  skill_choices: {
    count: number;
    options: string[];
  };
  spellcasting?: {
    spellcasting_ability: string;
  };
  features: ClassFeature[];
}
