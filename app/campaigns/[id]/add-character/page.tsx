'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ScrollText, UserMinus, UserPlus, Users } from 'lucide-react'
import { toast } from 'sonner'

import { PageWrapper } from '@/components/layout/PageWrapper'
import Loading from '@/components/custom/Loading'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { EmptyState } from '@/components/ui/empty-state'
import { Note } from '@/components/ui/note'
import { SelectableCard } from '@/components/ui/selectable-card'
import { useCampaign } from '@/hooks/queries/useCampaigns'
import { useMyCharacters } from '@/hooks/queries/useCharacter'
import {
  useAddCharactersToCampaign,
  useRemoveCharactersFromCampaign,
} from '@/hooks/mutations/useCampaignCharacterMutations'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { getItalianClass } from '@/lib/utils/nameMappers'

/** Personaggio come lo restituisce `/api/characters/me`. */
interface MyCharacter {
  id: number | string
  name: string
  level?: number
  campaign_id?: string | null
  classes?: { name: string } | null
  class?: string | null
  /** Relazione con la campagna corrente (può arrivare come oggetto o array) */
  campaigns?: { name: string; dungeon_master: string } | { name: string; dungeon_master: string }[] | null
}

function campaignNameOf(character: MyCharacter): string | null {
  const rel = character.campaigns
  if (!rel) return null
  if (Array.isArray(rel)) return rel[0]?.name ?? null
  return rel.name ?? null
}

function classLabelOf(character: MyCharacter): string {
  const raw = character.classes?.name ?? character.class ?? ''
  return raw ? getItalianClass(raw) : 'Classe sconosciuta'
}

/**
 * Aggiunge o rimuove personaggi da una campagna.
 *
 * Questa rotta era referenziata dal pulsante "Aggiungi Personaggio" della
 * pagina campagna ma non esisteva: il pulsante portava a un 404. Le API
 * (`POST`/`DELETE /api/characters/campaign/[id]`) c'erano già — mancava solo
 * l'interfaccia.
 */
export default function AddCharacterToCampaignPage() {
  const params = useParams()
  const campaignId = String(params.id ?? '')

  const { data: campaign, isLoading: isCampaignLoading } = useCampaign(campaignId)
  const { data: characters, isLoading: isCharactersLoading } = useMyCharacters()

  const addCharacters = useAddCharactersToCampaign(campaignId)
  const removeCharacters = useRemoveCharactersFromCampaign(campaignId)

  const [userId, setUserId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  // Derivato una volta sola: senza useMemo l'espressione logica creerebbe un
  // array nuovo a ogni render e invaliderebbe i due useMemo successivi.
  const mine = useMemo(() => (characters ?? []) as MyCharacter[], [characters])

  const inCampaign = useMemo(
    () => mine.filter((c) => c.campaign_id != null && String(c.campaign_id) === campaignId),
    [mine, campaignId],
  )

  // Disponibili: tutti i miei personaggi che non sono già in questa campagna.
  // Quelli che stanno in un'altra campagna restano selezionabili, ma lo diciamo:
  // l'aggiunta li sposta.
  const available = useMemo(
    () => mine.filter((c) => String(c.campaign_id ?? '') !== campaignId),
    [mine, campaignId],
  )

  const isDm = Boolean(
    campaign?.dungeon_master_id && userId && campaign.dungeon_master_id === userId,
  )

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const handleAdd = async () => {
    if (selected.length === 0) return
    try {
      await addCharacters.mutateAsync(selected)
      toast.success(
        selected.length === 1
          ? 'Personaggio aggiunto alla campagna'
          : `${selected.length} personaggi aggiunti alla campagna`,
      )
      setSelected([])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Errore imprevisto')
    }
  }

  const handleRemove = async (characterId: string, name: string) => {
    try {
      await removeCharacters.mutateAsync([characterId])
      toast.success(`${name} rimosso dalla campagna`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Errore imprevisto')
    }
  }

  if (isCampaignLoading || isCharactersLoading) {
    return <Loading />
  }

  return (
    <PageWrapper
      withContainer={false}
      title="Aggiungi Personaggi"
      subtitle={campaign?.name ? `Campagna «${campaign.name}»` : 'Gestisci chi partecipa alla campagna'}
      icon={<UserPlus className="w-6 h-6" />}
      maxWidth="xl"
      action={
        <Link
          href={`/campaigns/${campaignId}`}
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla campagna
        </Link>
      }
    >
      <div className="not-prose space-y-8">
        {!isDm && (
          <Note tone="warning" title="Puoi consultare, ma non modificare">
            Solo il Master della campagna può aggiungere o rimuovere personaggi.
          </Note>
        )}

        {/* Già nella campagna: si può rimuovere (il personaggio non viene
            eliminato, esce solo dalla campagna). */}
        {inCampaign.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-xl fantasy-title">
              <Users className="w-5 h-5 text-frame" aria-hidden="true" />
              Nella campagna
              <span className="text-sm font-normal text-ink-muted">({inCampaign.length})</span>
            </h2>
            <div className="space-y-2">
              {inCampaign.map((character) => (
                <div
                  key={character.id}
                  className="surface-flat flex items-center justify-between gap-3 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink-strong">{character.name}</p>
                    <p className="text-xs text-ink-muted">
                      {classLabelOf(character)} · Livello {character.level ?? 1}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!isDm || removeCharacters.isPending}
                    onClick={() => handleRemove(String(character.id), character.name)}
                  >
                    <UserMinus className="w-4 h-4" />
                    Rimuovi
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disponibili */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl fantasy-title">
            <ScrollText className="w-5 h-5 text-frame" aria-hidden="true" />
            Disponibili
            <span className="text-sm font-normal text-ink-muted">({available.length})</span>
          </h2>

          {available.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nessun personaggio da aggiungere"
              description="Tutti i tuoi personaggi fanno già parte di questa campagna."
            />
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {available.map((character) => {
                const otherCampaign = campaignNameOf(character)
                return (
                  <SelectableCard
                    key={character.id}
                    multiple
                    selected={selected.includes(String(character.id))}
                    disabled={!isDm}
                    onClick={() => toggle(String(character.id))}
                    className="flex flex-col gap-0.5"
                  >
                    <span className="block truncate font-medium text-ink-strong">
                      {character.name}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {classLabelOf(character)} · Livello {character.level ?? 1}
                      {otherCampaign && ` · attualmente in «${otherCampaign}»`}
                    </span>
                  </SelectableCard>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Barra azioni: compare solo quando c'è qualcosa da confermare, così la
          pagina non ha un pulsante sempre disabilitato. */}
      {selected.length > 0 && (
        <div className="surface-floating sticky bottom-4 z-20 mt-6 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            <strong className="font-semibold text-ink-strong">{selected.length}</strong>{' '}
            {selected.length === 1 ? 'personaggio selezionato' : 'personaggi selezionati'}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
              Deseleziona
            </Button>
            <Button onClick={handleAdd} disabled={!isDm || addCharacters.isPending}>
              <UserPlus className="w-4 h-4" />
              {addCharacters.isPending ? 'Aggiunta...' : 'Aggiungi alla campagna'}
            </Button>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
