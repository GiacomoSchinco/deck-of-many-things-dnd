import { useQuery } from '@tanstack/react-query';

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
  features: Array<{
    level: number;
    name: string;
    description: string;
  }>;
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async (): Promise<DndClass[]> => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Errore caricamento classi');
      return response.json() as Promise<DndClass[]>;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useClass(id: number | null) {
  return useQuery({
    queryKey: ['class', id],
    queryFn: async (): Promise<DndClass | null> => {
      if (!id) return null;
      const response = await fetch(`/api/classes/${id}`);
      if (!response.ok) throw new Error('Errore caricamento classe');
      return response.json() as Promise<DndClass>;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}