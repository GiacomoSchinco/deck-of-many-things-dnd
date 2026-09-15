// hooks/mutations/useCampaignCharacterMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Aggiunge o rimuove personaggi da una campagna.
 *
 * Le rotte esistono già (`POST` e `DELETE /api/characters/campaign/[id]`) e
 * verificano lato server che il chiamante sia il Master della campagna: quel
 * controllo non viene duplicato qui, l'errore del server viene solo mostrato.
 */
async function callCampaignCharacters(
  campaignId: string,
  method: 'POST' | 'DELETE',
  characterIds: string[],
) {
  const res = await fetch(`/api/characters/campaign/${campaignId}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ character_ids: characterIds }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.error ||
        (method === 'POST'
          ? 'Errore durante l’aggiunta dei personaggi'
          : 'Errore durante la rimozione dei personaggi'),
    );
  }

  return res.json();
}

/** Invalida tutto ciò che cambia quando un personaggio entra o esce da una campagna. */
function useInvalidateCampaign(campaignId: string) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['characters', 'campaign', campaignId] });
    queryClient.invalidateQueries({ queryKey: ['characters', 'me'] });
    queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
  };
}

export function useAddCharactersToCampaign(campaignId: string) {
  const invalidate = useInvalidateCampaign(campaignId);

  return useMutation({
    mutationFn: (characterIds: string[]) =>
      callCampaignCharacters(campaignId, 'POST', characterIds),
    onSuccess: invalidate,
  });
}

export function useRemoveCharactersFromCampaign(campaignId: string) {
  const invalidate = useInvalidateCampaign(campaignId);

  return useMutation({
    mutationFn: (characterIds: string[]) =>
      callCampaignCharacters(campaignId, 'DELETE', characterIds),
    onSuccess: invalidate,
  });
}
