export interface Race {
  id: number;
  name: string;
  description: string;
  speed: number;
  size: 'Small' | 'Medium' | 'Large';
  ability_bonuses: Record<string, number>;
  traits: Array<{ name: string; description: string }>;
  subraces?: Array<{
    name: string;
    ability_bonuses: Record<string, number>;
    traits: string[];
  }>;
}
