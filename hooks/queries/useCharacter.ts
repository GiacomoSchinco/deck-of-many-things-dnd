// Hook per caricare personaggi dal DB
import { useQuery } from '@tanstack/react-query';

// GET /api/characters — tutti i personaggi dell'utente
export function useCharacters() {
  return useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const res = await fetch('/api/characters');
      if (!res.ok) throw new Error('Errore caricamento personaggi');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

// GET /api/characters/me — personaggio corrente dell'utente
export function useMyCharacter() {
  return useQuery({
    queryKey: ['characters', 'me'],
    queryFn: async () => {
      const res = await fetch('/api/characters/me');
      if (!res.ok) throw new Error('Errore caricamento personaggio');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

// GET /api/characters/[id] — personaggio specifico con tutti i dettagli
export function useCharacter(characterId: string | null) {
  return useQuery({
    queryKey: ['character', characterId],
    queryFn: async () => {
      const res = await fetch(`/api/characters/${characterId}`);
      if (!res.ok) throw new Error('Errore caricamento personaggio');
      return res.json();
    },
    enabled: !!characterId,
    staleTime: 1000 * 60 * 5,
  });
}

// GET /api/characters/campaign/[id] — personaggi di una campagna
export function useCharactersByCampaign(campaignId: string | null) {
  return useQuery({
    queryKey: ['characters', 'campaign', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/characters/campaign/${campaignId}`);
      if (!res.ok) throw new Error('Errore caricamento personaggi campagna');
      return res.json();
    },
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 5,
  });
}

// GET /api/characters/[id]/combat-stats — statistiche di combattimento
export function useCharacterCombatStats(characterId: string | null) {
  return useQuery({
    queryKey: ['character', characterId, 'combat-stats'],
    queryFn: async () => {
      const res = await fetch(`/api/characters/${characterId}/combat-stats`);
      if (!res.ok) throw new Error('Errore caricamento combat stats');
      return res.json();
    },
    enabled: !!characterId,
    staleTime: 1000 * 60,
  });
}
// GET /api/characters/me/recent?limit=N — personaggi recenti
export function useMyRecentCharacters(limit = 3) {
  return useQuery({
    queryKey: ['characters', 'me', 'recent', limit],
    queryFn: async () => {
      const res = await fetch(`/api/characters/me/recent?limit=${limit}`);
      if (!res.ok) throw new Error('Errore caricamento personaggi recenti');
      return res.json();
    },
    staleTime: 1000 * 60,
  });
}