import { createCRUDMutations } from './createCRUDMutations'
import type { Campaign } from '@/types/campaign'

export interface CreateCampaignData {
  name: string
  description: string
}

export interface UpdateCampaignData {
  name?: string
  description?: string | null
  dungeon_master_id?: string | null
}

const { useCreate, useUpdate, useDelete } = createCRUDMutations<
  Campaign,
  CreateCampaignData,
  UpdateCampaignData,
  string
>({
  basePath: '/api/campaigns',
  queryKey: 'campaigns',
  errors: {
    create: 'Errore creazione campagna',
    update: 'Errore aggiornamento campagna',
    delete: 'Errore eliminazione campagna',
  },
})

export const useCreateCampaign = useCreate
export const useUpdateCampaign = useUpdate
export const useDeleteCampaign = useDelete
