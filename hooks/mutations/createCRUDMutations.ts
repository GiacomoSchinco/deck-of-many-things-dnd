// hooks/mutations/createCRUDMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface CRUDMutationsConfig {
  /** Base path API, es. '/api/items' */
  basePath: string
  /** Query key principale da invalidare, es. 'items' */
  queryKey: string
  /** Messaggi di errore (opzionali) */
  errors?: {
    create?: string
    update?: string
    delete?: string
  }
}

async function fetchJSON(url: string, options: RequestInit, errorMessage: string) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || errorMessage)
  }
  return res.json()
}

const jsonHeaders = { 'Content-Type': 'application/json' }

/**
 * Factory che genera i tre hook useMutation standard (create / update / delete)
 * per una risorsa REST con pattern /api/resource e /api/resource/:id
 */
export function createCRUDMutations<
  TEntity,
  TCreate,
  TUpdate,
  TId extends string | number = number,
>(config: CRUDMutationsConfig) {
  const { basePath, queryKey, errors = {} } = config

  function useCreate() {
    const qc = useQueryClient()
    return useMutation<TEntity, Error, TCreate>({
      mutationFn: (data) =>
        fetchJSON(basePath, { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) },
          errors.create ?? 'Errore creazione'),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [queryKey] })
      },
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation<TEntity, Error, { id: TId; data: TUpdate }>({
      mutationFn: ({ id, data }) =>
        fetchJSON(`${basePath}/${id}`, { method: 'PUT', headers: jsonHeaders, body: JSON.stringify(data) },
          errors.update ?? 'Errore aggiornamento'),
      onSuccess: (_, { id }) => {
        qc.invalidateQueries({ queryKey: [queryKey] })
        qc.invalidateQueries({ queryKey: [queryKey.replace(/s$/, ''), id] })
      },
    })
  }

  function useDelete() {
    const qc = useQueryClient()
    return useMutation<void, Error, TId>({
      mutationFn: (id) =>
        fetchJSON(`${basePath}/${id}`, { method: 'DELETE' },
          errors.delete ?? 'Errore eliminazione'),
      onSuccess: (_, id) => {
        qc.invalidateQueries({ queryKey: [queryKey] })
        qc.invalidateQueries({ queryKey: [queryKey.replace(/s$/, ''), id] })
      },
    })
  }

  return { useCreate, useUpdate, useDelete }
}
