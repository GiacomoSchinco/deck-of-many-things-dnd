// hooks/queries/useSavingThrows.ts
import { useQuery } from '@tanstack/react-query'

export interface SavingThrow {
  character_id: string;
  ability: string;
  proficient: boolean;
}

// GET tutti i tiri salvezza del personaggio
export function useSavingThrows(characterId: string | null) {
  return useQuery({
    queryKey: ['saving-throws', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      const res = await fetch(`/api/characters/${characterId}/saving-throws`);
      if (!res.ok) throw new Error('Errore caricamento tiri salvezza');
      const data = await res.json();
      return data as SavingThrow[];
    },
    enabled: !!characterId,
    staleTime: 1000 * 60 * 5,
  });
}

// GET tiro salvezza singolo
export function useSavingThrow(characterId: string | null, ability: string | null) {
  return useQuery({
    queryKey: ['saving-throw', characterId, ability],
    queryFn: async () => {
      if (!characterId || !ability) return null;
      const res = await fetch(`/api/characters/${characterId}/saving-throws/${ability}`);
      if (!res.ok) throw new Error('Errore caricamento tiro salvezza');
      return res.json() as Promise<SavingThrow>;
    },
    enabled: !!characterId && !!ability,
  });
}