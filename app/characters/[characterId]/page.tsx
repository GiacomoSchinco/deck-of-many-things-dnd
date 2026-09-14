// app/characters/[characterId]/page.tsx
"use client"

import { useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import AncientCardContainer from '@/components/custom/AncientCardContainer'
import StatDiamond from '@/components/custom/StatDiamond'
import HpBar from '@/components/custom/HpBar'
import { buttonVariants } from '@/components/ui/button-variants'
import { Heart, Package, Scroll, Shield, Trash, Wind, Zap } from 'lucide-react'
import { useDeleteCharacter } from '@/hooks/mutations/useCharacterMutations'
import Link from 'next/link'
import { useCharacter } from '@/hooks/queries/useCharacter'
import { useSkills, useSkillList } from '@/hooks/queries/useSkills'
import Loading from '@/components/custom/Loading'
import { FanCardGroup } from '@/components/custom/FanCardGroup'
import { RaceClassCard } from '@/components/custom/RaceClassCard'
import { AncientScroll } from '@/components/custom/AncientScroll'
import { SkillsDisplay } from '@/components/custom/SkillsDisplay'
import { useInventory } from '@/hooks/queries/useInventory'
import InventoryGrouped from '@/components/custom/InventoryGrouped'
import Spellbook from '@/components/character/sheet/Spellbook'
import type { ProficiencyType } from '@/types/character'
import { getItalianAbilityFull, getEnglishClass } from '@/lib/utils/nameMappers'
import { PREPARER_CLASSES } from '@/lib/rules/spellcasting'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatRow } from '@/components/shared/StatRow'
import { SectionTitle } from '@/components/shared/SectionTitle'

export default function CharacterPage() {
  const params = useParams()
  const characterId = params.characterId as string
  const router = useRouter()
  const deleteCharacter = useDeleteCharacter()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: character, isLoading, error } = useCharacter(characterId)
  const { data: characterSkills } = useSkills(characterId)
  const { data: allSkills, isLoading: skillsLoading } = useSkillList()
  const { data: inventory, isLoading: inventoryLoading } = useInventory(characterId) // ← NUOVO

  if (isLoading || skillsLoading || inventoryLoading) {
    return <Loading />
  }

  if (error || !character) {
    notFound()
  }

  const STATS = [
    { label: 'FOR', key: 'strength' },
    { label: 'DES', key: 'dexterity' },
    { label: 'COS', key: 'constitution' },
    { label: 'INT', key: 'intelligence' },
    { label: 'SAG', key: 'wisdom' },
    { label: 'CAR', key: 'charisma' },
  ]

  const isPreparerClass = (PREPARER_CLASSES as readonly string[]).includes(getEnglishClass(character?.classes?.name ?? ''))

  const proficiencyBonus = 2 + Math.floor((character.level - 1) / 4)

  // Iniziativa = modificatore di Destrezza (prima usava il bonus di competenza)
  const initiativeBonus = Math.floor(((character.ability_scores?.dexterity ?? 10) - 10) / 2)

  const handleDelete = async () => {
    try {
      await deleteCharacter.mutateAsync(characterId)
      toast.success(`${character.name} è stato eliminato`)
      setDeleteOpen(false)
      router.push('/characters')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore durante l'eliminazione")
    }
  }

  // Crea una mappa delle skill possedute dal personaggio
  const skillsMap = new Map<number, ProficiencyType>()
    ; (characterSkills as unknown as { skill_id: number; proficiency_type: ProficiencyType }[] | undefined)
      ?.forEach((skill) => {
        skillsMap.set(Number(skill.skill_id), skill.proficiency_type)
      })
  return (
    <PageWrapper
      withContainer={false}
      variant='scroll'
      title={character.name}
      subtitle={`${character.races?.name ?? ''} · ${character.classes?.name ?? ''} · Livello ${character.level}`}
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={`/characters/${characterId}/edit`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Modifica
          </Link>
          <Link
            href={`/characters/${characterId}/spells`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Scroll className="w-4 h-4 mr-2" />Incantesimi
          </Link>
          <Link
            href={`/characters/${characterId}/inventory`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Package className="w-4 h-4 mr-2" />Inventario
          </Link>
          <Link
            href={`/characters/${characterId}/level-up`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Zap className="w-4 h-4 mr-2" />Level Up
          </Link>

          <span className="mx-1 hidden h-5 w-px self-center bg-frame/30 sm:block" aria-hidden="true" />

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                />
              }
            >
              <Trash className="w-4 h-4 mr-2" />
              Elimina
            </DialogTrigger>
            {/* Montato solo mentre è aperto: evita che il popup resti nel DOM
                in stato inconsistente bloccando i click sulla pagina. */}
            {deleteOpen && (
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif text-lg">
                    Eliminare {character.name}?
                  </DialogTitle>
                  <DialogDescription>
                    L&apos;operazione non è reversibile: con il personaggio vengono rimossi anche
                    equipaggiamento, competenze e incantesimi associati.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                    Annulla
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteCharacter.isPending}
                  >
                    {deleteCharacter.isPending ? 'Eliminazione...' : 'Elimina definitivamente'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        </div>
      }
    >
    <div className="space-y-6">
      {/* Numeri chiave: quelli che servono davvero durante una sessione */}
      <section aria-label="Statistiche principali" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="panel p-4">
          <div className="flex items-center gap-2 text-ink-muted">
            <Heart className="h-4 w-4 text-frame" aria-hidden="true" />
            <span className="eyebrow">Punti Ferita</span>
          </div>
          <div className="mt-3">
            <HpBar
              current={character.combat_stats?.current_hp ?? 0}
              max={character.combat_stats?.max_hp ?? 1}
              tempHp={character.combat_stats?.temp_hp ?? 0}
              size="large"
            />
          </div>
        </div>

        {[
          { icon: Shield, label: 'Classe Armatura', value: `${character.combat_stats?.armor_class ?? 0}` },
          { icon: Zap, label: 'Iniziativa', value: `+${initiativeBonus}` },
          { icon: Wind, label: 'Velocità', value: `${character.combat_stats?.speed ?? 0} ft` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="panel p-4">
            <div className="flex items-center gap-2 text-ink-muted">
              <Icon className="h-4 w-4 text-frame" aria-hidden="true" />
              <span className="eyebrow">{label}</span>
            </div>
            <p className="stat-value mt-2 text-2xl">{value}</p>
          </div>
        ))}
      </section>

      {/* Razza e Classe */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FanCardGroup size="md" spread="normal" noWrapper>
          <RaceClassCard type='class' name={character?.classes?.name ?? '...'} size='md' isSelected={false} />
          <RaceClassCard type='race' name={character?.races?.name ?? '...'} size='md' isSelected={false} />
        </FanCardGroup>
        <AncientScroll variant='rolled'>
          <div >
            <SectionTitle size="lg">Caratteristiche</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STATS.map(({ label, key }) => (
                <StatDiamond
                  key={key}
                  label={label}
                  statKey={key}
                  value={character.ability_scores?.[key as keyof typeof character.ability_scores] || 10}
                  modifier={0}
                />
              ))}
            </div>

          </div>
        </AncientScroll>
      </div>
              
      {/* Competenze principali (riepilogo) */}


      {/* Griglia a 2 colonne */}
      <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-6">
        {/* Tiri salvezza: sempre competenti, quindi mostriamo il totale */}
        <AncientScroll className="p-6">
          <SectionTitle size="lg">Tiri Salvezza</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {(character.classes?.saving_throws ?? []).map((s: string) => {
              const abilityMod = Math.floor(
                ((character.ability_scores?.[s as keyof typeof character.ability_scores] ?? 10) - 10) / 2
              )
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-frame/25 bg-parchment-200/50 px-3 py-1.5 text-sm"
                >
                  <Shield className="h-3.5 w-3.5 text-frame" aria-hidden="true" />
                  <span className="fantasy-value">{getItalianAbilityFull(s)}</span>
                  <span className="stat-value text-xs text-frame-deep">
                    {proficiencyBonus + abilityMod >= 0 ? '+' : ''}
                    {proficiencyBonus + abilityMod}
                  </span>
                </span>
              )
            })}
          </div>
        </AncientScroll>

        {/* Info Personaggio */}
        <AncientScroll className="p-6">
          <SectionTitle size="lg">Info Personaggio</SectionTitle>
          <div className="space-y-4">
            <StatRow label="Background" value={character.background || 'Nessuno'} />
            <StatRow label="Allineamento" value={character.alignment || 'Neutrale'} />
            <StatRow label="Livello" value={character.level} />
            <StatRow label="Bonus Competenza" value={`+${proficiencyBonus}`} />
          </div>
        </AncientScroll>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-1 border-b border-frame/25 md:grid-cols-3">
          <TabsTrigger className="w-full text-center" value="skills">Abilità</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="spells">Incantesimi</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <AncientCardContainer className="p-6">
            {allSkills && (
              <SkillsDisplay
                skills={allSkills}
                characterSkills={skillsMap}
                abilityScores={character.ability_scores}
                proficiencyBonus={proficiencyBonus}
              />
            )}
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="spells">
          <AncientCardContainer className="p-6">
            <Spellbook
              characterId={characterId}
              classId={character?.class_id ?? undefined}
              characterLevel={character?.level ?? undefined}
              intelligenceScore={character?.ability_scores?.intelligence ?? undefined}
              isPreparer={isPreparerClass}
            />
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="inventory">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl fantasy-title mb-4">
              Inventario
            </h3>
            <InventoryGrouped items={inventory?.items} />
          </AncientCardContainer>

        </TabsContent>
      </Tabs>
    </div>
    </PageWrapper>
  )
}