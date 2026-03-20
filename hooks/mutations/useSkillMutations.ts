// hooks/mutations/useSkillMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateSkillDTO {
  skill_id: number;
  proficiency_type?: 'none' | 'proficient' | 'expertise' | 'half';
}

interface UpdateSkillDTO {
  proficiency_type: 'none' | 'proficient' | 'expertise' | 'half';
}

// Creazione multipla competenze
export function useCreateSkills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { characterId: string; skills: CreateSkillDTO[] }) => {
      const { characterId, skills } = payload
      if (!characterId) throw new Error('Missing character id')
      const res = await fetch(`/api/characters/${characterId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills }),
      })
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown' }))
        throw new Error(error.error || 'Errore creazione competenze')
      }
      return res.json()
    },    onSuccess: (_data, variables) => {
      // variables.characterId is available here
      queryClient.invalidateQueries({ queryKey: ['skills', variables.characterId] })
    },
  })
}

// Aggiornamento competenza singola
export function useUpdateSkill(characterId: string | null, skillId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSkillDTO) => {
      if (!characterId) throw new Error('Missing character id');
      const idSegment = typeof skillId === 'number' ? skillId : encodeURIComponent(String(skillId));
      const res = await fetch(`/api/characters/${characterId}/skills/${idSegment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore aggiornamento competenza');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills', characterId] });
      queryClient.invalidateQueries({ queryKey: ['skill', characterId, skillId] });
    },
  });
}

// Eliminazione competenza singola
export function useDeleteSkill(characterId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: number | string) => {
      if (!characterId) throw new Error('Missing character id');
      const idSegment = typeof skillId === 'number' ? skillId : encodeURIComponent(String(skillId));
      const res = await fetch(`/api/characters/${characterId}/skills/${idSegment}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore eliminazione competenza');
      }
      return res.json();
    },
    onSuccess: (_data, skillId) => {
      queryClient.invalidateQueries({ queryKey: ['skills', characterId] });
      queryClient.invalidateQueries({ queryKey: ['skill', characterId, skillId] });
    },
  });
}

// Hook unificato
export function useSkillMutations() {
  return {
    create: useCreateSkills(),
  };
}