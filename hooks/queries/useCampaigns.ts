import { useQuery } from '@tanstack/react-query';
import type { Campaign } from '@/types/campaign';

export type { Campaign };

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
export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ['campaign', id],   
    queryFn: async (): Promise<Campaign | null> => {
      if (!id) return null;
      const response = await fetch(`/api/campaigns/${id}`);
      if (!response.ok) throw new Error('Errore caricamento campagna');
      return response.json() as Promise<Campaign>;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// Campagne dove sei Master
export function useMasterCampaigns() {
  return useQuery({
    queryKey: ['campaigns', 'me', 'master'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns/me/master');
      if (!res.ok) throw new Error('Errore caricamento campagne master');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Campagne dove hai personaggi (giocatore)
export function usePlayerCampaigns() {
  return useQuery({
    queryKey: ['campaigns', 'me', 'player'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns/me/player');
      if (!res.ok) throw new Error('Errore caricamento campagne giocatore');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}