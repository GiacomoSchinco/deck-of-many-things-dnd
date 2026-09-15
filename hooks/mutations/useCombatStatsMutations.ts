// hooks/mutations/useCombatStatsMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface CombatStatsData {
  max_hp: number;
  current_hp: number;
  temp_hp?: number;
  hit_dice_type: string;
  hit_dice_total?: number;
  hit_dice_used?: number;
  armor_class: number;
  initiative_bonus?: number;
  speed?: number;
  inspiration?: boolean;
}

export function useUpdateCombatStats(characterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (combatStats: CombatStatsData) => {
      const res = await fetch(`/api/characters/${characterId}/combat-stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combatStats),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore aggiornamento combat stats');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combat-stats', characterId] });
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
    },
  });
}