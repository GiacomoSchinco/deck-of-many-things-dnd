import { useQuery } from '@tanstack/react-query';
import type { Race } from '@/types/race';

export type { Race };

export function useRaces() {
  return useQuery({
    queryKey: ['races'],
    queryFn: async (): Promise<Race[]> => {
      const response = await fetch('/api/races');
      if (!response.ok) throw new Error('Errore caricamento razze');
      return response.json() as Promise<Race[]>;
    },
    staleTime: 1000 * 60 * 5, // 5 minuti
    gcTime: 1000 * 60 * 10,    // 10 minuti
  });
}

export function useRace(id: number | null) {
  return useQuery({
    queryKey: ['race', id],
    queryFn: async (): Promise<Race | null> => {
      if (!id) return null;
      const response = await fetch(`/api/races/${id}`);
      if (!response.ok) throw new Error('Errore caricamento razza');
      return response.json() as Promise<Race>;
    },
    enabled: !!id, 
    staleTime: 1000 * 60 * 5,
  });
}