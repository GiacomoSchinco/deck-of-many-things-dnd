"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCampaign } from '@/hooks/mutations/useCampaignMutations'
import { PlusCircle, Loader2 } from 'lucide-react'
import { AncientScroll } from '@/components/custom/AncientScroll'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function CreateCampaignPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateCampaign()

  const [formData, setFormData] = useState({ name: '', description: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const name = formData.name.trim()
    const description = formData.description.trim()

    if (!description) return alert('La descrizione è obbligatoria')

    try {
      const created = await mutateAsync({ name, description })
      const id = Array.isArray(created) ? created[0]?.id : created?.id
      
      router.push(id ? `/campaigns/${id}` : '/campaigns')
    } catch (err) {
      console.error('Errore creazione campagna:', err)
    }
  }

  return (
    <PageWrapper
      withContainer={false}
      title="Crea Nuova Campagna"
    >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-700">Nome</label>
            <Input 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-700">Descrizione</label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              rows={6} 
              required 
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800" 
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4 mr-2" />
              )}
              {isPending ? 'Creazione...' : 'Crea'}
            </Button>
          </div>
        </form>
    </PageWrapper>
  )
}