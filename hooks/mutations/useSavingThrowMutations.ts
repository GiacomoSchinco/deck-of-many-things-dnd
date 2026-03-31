// hooks/mutations/useSavingThrowMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateSavingThrowDTO {
  ability: string;
  proficient: boolean;
}

interface UpdateSavingThrowDTO {
  proficient: boolean;
}

// Creazione multipla tiri salvezza
export function useCreateSavingThrows(characterId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (savingThrows: CreateSavingThrowDTO[]) => {
      if (!characterId) throw new Error('Missing character id');
      const res = await fetch(`/api/characters/${characterId}/saving-throws`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saving_throws: savingThrows }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore creazione tiri salvezza');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-throws', characterId] });
    },
  });
}

// Aggiornamento tiro salvezza singolo
export function useUpdateSavingThrow(characterId: string | null, ability: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSavingThrowDTO) => {
      if (!characterId) throw new Error('Missing character id');
      const res = await fetch(`/api/characters/${characterId}/saving-throws/${ability}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore aggiornamento tiro salvezza');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saving-throws', characterId] });
      queryClient.invalidateQueries({ queryKey: ['saving-throw', characterId, ability] });
    },
  });
}

// Versione con characterId nel payload (utile quando l'id è noto solo al momento della chiamata)
export function useApplySavingThrows() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      savingThrows,
    }: {
      characterId: string;
      savingThrows: CreateSavingThrowDTO[];
    }) => {
      const res = await fetch(`/api/characters/${characterId}/saving-throws`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saving_throws: savingThrows }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Errore salvataggio tiri salvezza');
      }
      return res.json();
    },
    onSuccess: (_data, { characterId }) => {
      queryClient.invalidateQueries({ queryKey: ['saving-throws', characterId] });
    },
  });
}

// Hook unificato
export function useSavingThrowMutations(characterId: string | null) {
  return {
    create: useCreateSavingThrows(characterId),
    update: useUpdateSavingThrow,
  };
}