 'use client'

import React, { useState, useCallback, memo } from 'react'
import { useCharacterSpells, useCharacterSpellSlots } from '@/hooks/queries/useSpells'
import { useCharacterSpellMutations } from '@/hooks/mutations/useCharacterSpellMutations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SpellDetailDialog from '@/components/custom/SpellDetailDialog'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import type { SpellKnown, Spell, SpellSchool, SpellSlot } from '@/types/spell'

const schoolColors: Record<SpellSchool, string> = {
  abjuration:   'bg-blue-100 text-blue-800',
  conjuration:  'bg-amber-100 text-amber-800',
  divination:   'bg-purple-100 text-purple-800',
  enchantment:  'bg-pink-100 text-pink-800',
  evocation:    'bg-red-100 text-red-800',
  illusion:     'bg-teal-100 text-teal-800',
  necromancy:   'bg-gray-800 text-gray-100',
  transmutation:'bg-indigo-100 text-indigo-800',
}

const schoolNames: Record<SpellSchool, string> = {
  abjuration:   'Abiurazione',
  conjuration:  'Evocazione',
  divination:   'Divinazione',
  enchantment:  'Ammaliamento',
  evocation:    'Invocazione',
  illusion:     'Illusione',
  necromancy:   'Necromanzia',
  transmutation:'Trasmutazione',
}

interface SpellbookProps {
  characterId: string
}

export default function Spellbook({ characterId }: SpellbookProps) {
  const { data: spellsKnown, isLoading } = useCharacterSpells(characterId)
  const { data: spellSlots } = useCharacterSpellSlots(characterId)
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)

  if (isLoading) {
    return <p className="text-amber-700 text-center py-4">Caricamento incantesimi...</p>
  }

  if (!spellsKnown || spellsKnown.length === 0) {
    return <p className="text-amber-700 text-center py-4">Nessun incantesimo presente</p>
  }

  const cantrips: SpellKnown[] = spellsKnown.filter((sk: SpellKnown) => sk.spell?.level === 0)
  const leveledSpells: SpellKnown[] = spellsKnown.filter((sk: SpellKnown) => (sk.spell?.level ?? 0) > 0)

  const byLevel: Record<number, SpellKnown[]> = {}
  for (const sk of leveledSpells) {
    const lvl = sk.spell?.level ?? 1
    if (!byLevel[lvl]) byLevel[lvl] = []
    byLevel[lvl].push(sk)
  }

  const slotsByLevel: Record<number, SpellSlot> = {}
  if (Array.isArray(spellSlots)) {
    for (const slot of spellSlots as SpellSlot[]) {
      slotsByLevel[slot.spell_level] = slot
    }
  }

  return (
    <>
      <div className="space-y-6">
        {cantrips.length > 0 && (
          <section>
            <h4 className="text-lg font-serif font-bold text-amber-900 mb-3 pb-1 border-b border-amber-200">
              Trucchetti
            </h4>
            <div className="space-y-2">
                  {cantrips.map((sk: SpellKnown) => sk.spell && (
                <SpellRow key={sk.id} sk={sk} onClick={setSelectedSpell} characterId={characterId} />
              ))}
            </div>
          </section>
        )}

        {Object.keys(byLevel)
          .map(Number)
          .sort((a, b) => a - b)
          .map(lvl => {
            const slot = slotsByLevel[lvl]
            return (
              <section key={lvl}>
                <div className="flex justify-between items-baseline mb-3 pb-1 border-b border-amber-200">
                  <h4 className="text-lg font-serif font-bold text-amber-900">Livello {lvl}</h4>
                  {slot && slot.total_slots > 0 && (
                    <span className="text-sm text-amber-700 font-medium">
                      Slot: {slot.total_slots - slot.used_slots}/{slot.total_slots}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {byLevel[lvl].map((sk: SpellKnown) => sk.spell && (
                    <SpellRow key={sk.id} sk={sk} onClick={setSelectedSpell} characterId={characterId} />
                  ))}
                </div>
              </section>
            )
          })}
      </div>

      <SpellDetailDialog
        spell={selectedSpell}
        open={selectedSpell !== null}
        onClose={() => setSelectedSpell(null)}
      />
    </>
  )
}

const SpellRow = memo(function SpellRow({ sk, onClick, characterId, onDelete }: { sk: SpellKnown; onClick: (spell: Spell) => void; characterId: string; onDelete?: (knownIds: string[]) => Promise<void> | void }) {
  const spell = sk.spell!
  const schoolKey = spell.school as SpellSchool
  const schoolColor = schoolColors[schoolKey] ?? 'bg-gray-100 text-gray-800'
  const schoolName = schoolNames[schoolKey] ?? String(spell.school)
  const { remove } = useCharacterSpellMutations()
  const [deleting, setDeleting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const doDelete = useCallback(async (e?: React.MouseEvent<HTMLElement>) => {
    if (e) e.stopPropagation()
    try {
      setDeleting(true)
      if (onDelete) {
        await Promise.resolve(onDelete([sk.id]))
      } else if (remove) {
        await remove.mutateAsync({ characterId, knownIds: [sk.id] })
      } else {
        throw new Error('Mutation non disponibile')
      }
      toast.success('Incantesimo rimosso')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Errore rimozione incantesimo')
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }, [characterId, onDelete, remove, sk.id])

  return (
    <div
      role="button"
      onClick={() => onClick(spell)}
      className="w-full p-3 bg-amber-50 rounded-lg border border-amber-100 space-y-1 text-left hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer flex items-start justify-between"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-amber-900">{spell.name}</span>
          <Badge className={`text-xs ${schoolColor}`}>{schoolName}</Badge>
          {spell.ritual && (
            <Badge className="text-xs bg-emerald-100 text-emerald-800">Rituale</Badge>
          )}
          {spell.concentration && (
            <Badge className="text-xs bg-orange-100 text-orange-800">Concentrazione</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-amber-700 mt-1">
          {spell.casting_time && <span>⏱ {spell.casting_time}</span>}
          {spell.range && <span>🎯 {spell.range}</span>}
          {spell.duration && <span>⏳ {spell.duration}</span>}
        </div>
      </div>

      <div className="ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {confirming ? (
          <div className="flex items-center gap-1">
            <Button size="sm" variant="destructive" onClick={() => { void doDelete(); }} disabled={deleting}>Conferma</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>Annulla</Button>
          </div>
        ) : (
          <Button size="icon" variant="ghost" onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setConfirming(true); }} disabled={deleting}>
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  )
})

SpellRow.displayName = 'SpellRow'
