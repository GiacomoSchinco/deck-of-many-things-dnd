// hooks/queries/useCombatStats.ts
import { useQuery } from '@tanstack/react-query';

export function useCombatStats(characterId: string | null) {
  return useQuery({
    queryKey: ['combatStats', characterId],
    queryFn: async () => {
      if (!characterId) return null;
      
      const res = await fetch(`/api/characters/${characterId}/combat-stats`);
      if (!res.ok) throw new Error('Errore caricamento combat stats');
      
      return res.json();
    },
    enabled: !!characterId,
  });
}