import { useQuery } from '@tanstack/react-query';
import type { DndClass } from '@/types/class';

export type { DndClass };

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