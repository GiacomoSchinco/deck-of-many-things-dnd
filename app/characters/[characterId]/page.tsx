// app/characters/[characterId]/page.tsx
"use client"

import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AncientCardContainer from '@/components/custom/AncientCardContainer'
import StatDiamond from '@/components/custom/StatDiamond'
import { Button } from '@/components/ui/button'
import { Scroll, Package, Zap } from 'lucide-react'
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
import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatRow } from '@/components/shared/StatRow'
import { SectionTitle } from '@/components/shared/SectionTitle'

export default function CharacterPage() {
  const params = useParams()
  const characterId = params.characterId as string

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

  const PREPARER_CLASSES = ['cleric', 'druid', 'paladin']
  const isPreparerClass = PREPARER_CLASSES.includes(getEnglishClass(character?.classes?.name ?? ''))

  const proficiencyBonus = 2 + Math.floor((character.level - 1) / 4)

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
          <Link href={`/characters/${characterId}/edit`}>
            <Button variant="outline" size="sm">Modifica</Button>
          </Link>
          <Link href={`/characters/${characterId}/spells`}>
            <Button variant="outline" size="sm">
              <Scroll className="w-4 h-4 mr-2" />Incantesimi
            </Button>
          </Link>
          <Link href={`/characters/${characterId}/inventory`}>
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-2" />Inventario
            </Button>
          </Link>
          <Link href={`/characters/${characterId}/level-up`}>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />Level Up
            </Button>
          </Link>
        </div>
      }
    >
    <div className="not-prose space-y-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caratteristiche */}
        <AncientScroll className="p-6">
          <SectionTitle size="lg">Info Combattimento</SectionTitle>
          <div className="space-y-4">
            <StatRow label="Punti Ferita" value={`${character.combat_stats?.current_hp}/${character.combat_stats?.max_hp}`} />
            <StatRow label="Classe Armatura" value={character.combat_stats?.armor_class} />
            <StatRow label="Velocità" value={`${character.combat_stats?.speed} ft`} />
            <StatRow label="Iniziativa" value={`+${proficiencyBonus}`} />
          </div>
        </AncientScroll>
        {/* Info Personaggio */}
        <AncientScroll className="p-6">
          <SectionTitle size="lg">Info Personaggio</SectionTitle>
          <div className="space-y-4">
            <StatRow label="Background" value={character.background || 'Nessuno'} />
            <StatRow label="Allineamento" value={character.alignment || 'Neutrale'} />
            <StatRow label="Bonus Competenza" value={`+${proficiencyBonus}`} />
            <StatRow
              label="Tiri Salvezza"
              value={character.classes?.saving_throws?.map((s: string) => getItalianAbilityFull(s)).join(' · ')}
            />
          </div>
        </AncientScroll>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-4 border-b border-amber-200">
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