import { useQuery } from '@tanstack/react-query';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  dungeon_master: string;
}

export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) throw new Error('Errore caricamento campagne');
      return response.json() as Promise<Campaign[]>;
    },
    staleTime: 1000 * 60 * 5,
  });
}