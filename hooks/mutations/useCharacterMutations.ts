// hooks/mutations/useCharacterMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AbilityScores, CombatStats } from '../../types/character';

export interface CreateCharacterData {
  name: string;
  playerName?: string;
  campaignId?: string;
  raceId: string;
  classId: string;
  level?: number;
  experience?: number;
  background?: string;
  alignment?: string;
  abilityScores?: AbilityScores;
  combatStats?: Partial<CombatStats>;
}

export type UpdateCharacterData = Partial<CreateCharacterData>;

// Hook per creare personaggio
export function useCreateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterData: CreateCharacterData) => {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore creazione personaggio');
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Invalida le query correlate
      queryClient.invalidateQueries({ queryKey: ['characters', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['characters', 'all'] });
    },
  });
}

// Hook per aggiornare personaggio
export function useUpdateCharacter(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (characterData: UpdateCharacterData) => {
      const res = await fetch(`/api/characters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore aggiornamento personaggio');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character', id] });
      queryClient.invalidateQueries({ queryKey: ['characters', 'me'] });
    },
  });
}

// Hook per eliminare personaggio
export function useDeleteCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/characters/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore eliminazione personaggio');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['characters', 'all'] });
    },
  });
}