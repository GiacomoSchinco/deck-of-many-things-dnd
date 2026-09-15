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
import StatDiamond from '@/components/custom/StatDiamond'
import HpBar from '@/components/custom/HpBar'
import { buttonVariants } from '@/components/ui/button-variants'
import { Heart, Package, Pencil, Scroll, Shield, Sparkles, Trash, Wind, Zap } from 'lucide-react'
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
import { StatTile } from '@/components/ui/stat-tile'
import { cn } from '@/lib/utils'
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

  /** Segno sempre esplicito: "+3" e "0" si leggono, "3" no. */
  const formatModifier = (n: number) => (n >= 0 ? `+${n}` : `${n}`)

  // Il medaglione dei PF cambia tono con lo stato: è l'unico numero che
  // conviene leggere a colpo d'occhio senza confrontarlo con il massimo.
  const hpPercent =
    (character.combat_stats?.max_hp ?? 0) > 0
      ? ((character.combat_stats?.current_hp ?? 0) / (character.combat_stats?.max_hp ?? 1)) * 100
      : 0
  const hpToneClass =
    hpPercent <= 25 ? 'text-destructive' : hpPercent <= 50 ? 'text-antique-gold' : 'text-success'

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
      title={<span className="text-foil">{character.name}</span>}
      subtitle={`${character.races?.name ?? ''} · ${character.classes?.name ?? ''} · Livello ${character.level}`}
      action={
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Gerarchia esplicita: la progressione è l'azione principale, la
              consultazione è secondaria, l'eliminazione sta isolata in fondo.
              Prima erano cinque pulsanti di pari peso. */}
          <Link
            href={`/characters/${characterId}/level-up`}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            Level Up
          </Link>
          <Link
            href={`/characters/${characterId}/edit`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
            Modifica
          </Link>
          <Link
            href={`/characters/${characterId}/spells`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Scroll className="w-4 h-4" aria-hidden="true" />
            Incantesimi
          </Link>
          <Link
            href={`/characters/${characterId}/inventory`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Package className="w-4 h-4" aria-hidden="true" />
            Inventario
          </Link>

          <span className="hidden h-5 w-px bg-frame/30 sm:block" aria-hidden="true" />

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
      {/* 1 · Fascia vitalità.
             I PF sono la cosa che si guarda di più in sessione, quindi hanno una
             riga tutta loro con la barra a tutta larghezza. Prima erano quattro
             riquadri diversi nella stessa griglia (uno con barra, tre con un
             numero) e la riga risultava disallineata. */}
      <section aria-label="Punti ferita" className="surface-tile p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex items-center gap-2.5 sm:w-44 sm:shrink-0">
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full surface-well',
                hpToneClass
              )}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="eyebrow">Punti Ferita</span>
          </div>
          <div className="min-w-0 flex-1">
            <HpBar
              current={character.combat_stats?.current_hp ?? 0}
              max={character.combat_stats?.max_hp ?? 1}
              tempHp={character.combat_stats?.temp_hp ?? 0}
              size="large"
            />
          </div>
        </div>
      </section>

      {/* 2 · Tre tessere identiche: stessa anatomia, stesso peso ottico,
             stessa altezza (è StatTile a garantirle). */}
      <section aria-label="Difese e movimento" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          icon={Shield}
          label="Armatura"
          value={character.combat_stats?.armor_class ?? 0}
        />
        <StatTile icon={Zap} label="Iniziativa" value={formatModifier(initiativeBonus)} />
        <StatTile
          icon={Wind}
          label="Velocità"
          value={character.combat_stats?.speed ?? 0}
          suffix="ft"
        />
      </section>

      {/* 3 · Identità e Caratteristiche: due pannelli gemelli. Stesso variant,
             stesso padding, stessa altezza (`items-stretch` + `h-full`).
             Prima a sinistra c'era un ventaglio di carte e a destra un papiro
             "rolled": forme diverse e altezze diverse nella stessa riga. */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <AncientScroll className="h-full p-6">
          <SectionTitle size="lg">Identità</SectionTitle>
          <div className="flex justify-center pt-2">
            <FanCardGroup size="md" spread="normal" noWrapper>
              <RaceClassCard type='class' name={character?.classes?.name ?? '...'} size='md' isSelected={false} />
              <RaceClassCard type='race' name={character?.races?.name ?? '...'} size='md' isSelected={false} />
            </FanCardGroup>
          </div>
        </AncientScroll>

        <AncientScroll className="h-full p-6">
          <SectionTitle size="lg">Caratteristiche</SectionTitle>
          <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3">
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
        </AncientScroll>
      </div>

      {/* 4 · Tiri salvezza e Info: stessi due pannelli, stessa altezza.
             I tiri passano da pillole che andavano a capo a una griglia
             regolare, così 2, 3 o 6 tiri restano sempre allineati. */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <AncientScroll className="h-full p-6">
          <SectionTitle size="lg">Tiri Salvezza</SectionTitle>
          {(character.classes?.saving_throws?.length ?? 0) === 0 ? (
            <p className="text-center text-sm text-ink-muted py-2">
              Nessun tiro salvezza dalla classe.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(character.classes?.saving_throws ?? []).map((s: string) => {
                const abilityMod = Math.floor(
                  ((character.ability_scores?.[s as keyof typeof character.ability_scores] ?? 10) - 10) / 2
                )
                const total = proficiencyBonus + abilityMod
                return (
                  <div
                    key={s}
                    className="surface-flat flex items-center justify-between gap-2 px-3 py-2"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Shield className="h-3.5 w-3.5 shrink-0 text-frame" aria-hidden="true" />
                      <span className="truncate font-medium text-ink-strong">
                        {getItalianAbilityFull(s)}
                      </span>
                    </span>
                    <span className="stat-value text-sm">{formatModifier(total)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </AncientScroll>

        <AncientScroll className="h-full p-6">
          <SectionTitle size="lg">Info Personaggio</SectionTitle>
          <div className="space-y-2">
            <StatRow label="Background" value={character.background || 'Nessuno'} />
            <StatRow label="Allineamento" value={character.alignment || 'Neutrale'} />
            <StatRow label="Livello" value={character.level} />
            <StatRow label="Bonus Competenza" value={formatModifier(proficiencyBonus)} />
          </div>
        </AncientScroll>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger className="w-full gap-1.5 text-center" value="skills">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Competenze
          </TabsTrigger>
          <TabsTrigger className="w-full gap-1.5 text-center" value="spells">
            <Scroll className="w-4 h-4" aria-hidden="true" />
            Incantesimi
          </TabsTrigger>
          <TabsTrigger className="w-full gap-1.5 text-center" value="inventory">
            <Package className="w-4 h-4" aria-hidden="true" />
            Inventario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <AncientScroll className="p-6">
            {allSkills && (
              <SkillsDisplay
                showTitle={false}
                skills={allSkills}
                characterSkills={skillsMap}
                abilityScores={character.ability_scores}
                proficiencyBonus={proficiencyBonus}
              />
            )}
          </AncientScroll>
        </TabsContent>

        <TabsContent value="spells">
          <AncientScroll className="p-6">
            <Spellbook
              characterId={characterId}
              classId={character?.class_id ?? undefined}
              characterLevel={character?.level ?? undefined}
              intelligenceScore={character?.ability_scores?.intelligence ?? undefined}
              isPreparer={isPreparerClass}
            />
          </AncientScroll>
        </TabsContent>

        <TabsContent value="inventory">
          <AncientScroll className="p-6">
            <h3 className="text-xl fantasy-title mb-4">
              Inventario
            </h3>
            <InventoryGrouped items={inventory?.items} />
          </AncientScroll>
        </TabsContent>
      </Tabs>
    </div>
    </PageWrapper>
  )
}