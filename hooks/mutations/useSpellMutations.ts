import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateSpellDTO, UpdateSpellDTO, Spell } from '@/types/spell'

export function useCreateSpell() {
	const queryClient = useQueryClient()
	return useMutation<Spell, unknown, CreateSpellDTO>({
		mutationFn: async (data: CreateSpellDTO) => {
			const res = await fetch(`/api/spells`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})
			if (!res.ok) {
				const err = await res.json()
				throw new Error(err.error || 'Errore creazione incantesimo')
			}
			return res.json() as Promise<Spell>
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['spells'] })
		}
	})
}

export function useUpdateSpell() {
	const queryClient = useQueryClient()
	return useMutation<Spell, unknown, { id: number; data: UpdateSpellDTO }>({
		mutationFn: async ({ id, data }) => {
			const res = await fetch(`/api/spells/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})
			if (!res.ok) {
				const err = await res.json()
				throw new Error(err.error || 'Errore aggiornamento incantesimo')
			}
			return res.json() as Promise<Spell>
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['spells'] })
			queryClient.invalidateQueries({ queryKey: ['spell', variables.id] })
		}
	})
}

export function useDeleteSpell() {
	const queryClient = useQueryClient()
	return useMutation<void, unknown, number>({
		mutationFn: async (id: number) => {
			const res = await fetch(`/api/spells/${id}`, { method: 'DELETE' })
			if (!res.ok) {
				const err = await res.json()
				throw new Error(err.error || 'Errore eliminazione incantesimo')
			}
			return res.json()
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ['spells'] })
			queryClient.invalidateQueries({ queryKey: ['spell', id] })
		}
	})
}

export function useSpellMutations() {
	return {
		create: useCreateSpell(),
		update: useUpdateSpell(),
		delete: useDeleteSpell(),
	}
}

