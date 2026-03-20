// hooks/queries/useSkills.ts
import { Skill } from '@/types/skill';
import { useQuery } from '@tanstack/react-query'

export interface SkillProficiency {
  character_id: string;
  skill_name: string;
  proficiency_type: 'none' | 'proficient' | 'expertise' | 'half';
}

// GET tutte le competenze del personaggio
export function useSkills(characterId: string | null) {
  return useQuery({
    queryKey: ['skills', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      const res = await fetch(`/api/characters/${characterId}/skills`);
      if (!res.ok) throw new Error('Errore caricamento competenze');
      const data = await res.json();
      return data as SkillProficiency[];
    },
    enabled: !!characterId,
    staleTime: 1000 * 60 * 5,
  });
}

// GET competenza singola (opzionale)
export function useSkill(characterId: string | null, skillName: string | null) {
  return useQuery({
    queryKey: ['skill', characterId, skillName],
    queryFn: async () => {
      if (!characterId || !skillName) return null;
      const res = await fetch(`/api/characters/${characterId}/skills/${skillName}`);
      if (!res.ok) throw new Error('Errore caricamento competenza');
      return res.json() as Promise<SkillProficiency>;
    },
    enabled: !!characterId && !!skillName,
  });
}

export function useSkillList() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await fetch(`/api/skills`);
      if (!res.ok) throw new Error('Errore caricamento competenze');
      return res.json() as Promise<Skill[]>;
    },
  });
}