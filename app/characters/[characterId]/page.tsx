// app/characters/[characterId]/page.tsx
"use client"

import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AncientCardContainer from '@/components/custom/AncientCardContainer'
import StatDiamond from '@/components/custom/StatDiamond'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Scroll, Package, Zap, Heart, Shield, Footprints, Zap as InitiativeIcon } from 'lucide-react'
import Link from 'next/link'
import { useCharacter } from '@/hooks/queries/useCharacter'
import { useSkills, useSkillList } from '@/hooks/queries/useSkills'
import Loading from '@/components/custom/Loading'
import { FanCardGroup } from '@/components/custom/FanCardGroup'
import { RaceClassCard } from '@/components/custom/RaceClassCard'
import { AncientScroll } from '@/components/custom/AncientScroll'
import { SkillsDisplay } from '@/components/custom/SkillsDisplay'
import { useInventory } from '@/hooks/queries/useInventory'
import type { Skill } from '@/types/skill'
import InventoryGrouped from '@/components/custom/InventoryGrouped'
import Spellbook from '@/components/character/sheet/Spellbook'

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

  const proficiencyBonus = 2 + Math.floor((character.level - 1) / 4)
  const initiative = character.combat_stats?.initiative_bonus ?? 0

  // Crea una mappa delle skill possedute dal personaggio
  const skillsMap = new Map<number, string>()
  ;(characterSkills as unknown as { skill_id: number; proficiency_type: string }[] | undefined)
    ?.forEach((skill) => {
      skillsMap.set(Number(skill.skill_id), skill.proficiency_type)
    })
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-amber-900">
            {character.name}
          </h1>
          <p className="text-amber-700">
            Livello {character.level}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/characters/${characterId}/edit`}>
            <Button variant="outline" size="sm">
              Modifica
            </Button>
          </Link>
          <Link href={`/characters/${characterId}/spells`}>
            <Button variant="outline" size="sm">
              <Scroll className="w-4 h-4 mr-2" />
              Incantesimi
            </Button>
          </Link>
          <Link href={`/characters/${characterId}/inventory`}>
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </Button>
          </Link>
          <Link href={`/characters/${characterId}/level-up`}>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Level Up
            </Button>
          </Link>
        </div>
      </div>

      {/* Razza e Classe */}
      <FanCardGroup size="md" spread="normal" noWrapper>
        <RaceClassCard type='race' name={character?.races?.name ?? '...'} size='md' isSelected={false} />
        <RaceClassCard type='class' name={character?.classes?.name ?? '...'} size='md' isSelected={false} />
      </FanCardGroup>

      {/* Competenze principali (riepilogo) */}
      <AncientScroll variant='rolled'>
        <div className="p-4">
          <p className="text-xs text-amber-600 mb-2 text-center">Competenze di Classe</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from(skillsMap.keys()).map(skillId => {
              const skill = allSkills?.find((s: Skill) => s.id === skillId)
              if (!skill) return null
              // Calcola bonus per il badge
              const abilityScore = character.ability_scores?.[skill.ability as keyof typeof character.ability_scores] || 10
              const abilityMod = Math.floor((abilityScore - 10) / 2)
              const profType = skillsMap.get(skillId)
              let bonus = abilityMod
              if (profType === 'proficient') bonus += proficiencyBonus
              if (profType === 'expertise') bonus += proficiencyBonus * 2
              if (profType === 'half') bonus += Math.floor(proficiencyBonus / 2)
              return (
                <Badge key={skillId} className="bg-amber-200 text-amber-900">
                  {skill.name_it} (+{bonus})
                </Badge>
              )
            })}
            {skillsMap.size === 0 && (
              <p className="text-amber-600 text-sm">Nessuna competenza selezionata</p>
            )}
          </div>
        </div>
      </AncientScroll>

      {/* Combat Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AncientCardContainer className="p-4 text-center" size='sm'>
          <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <p className="text-xs text-amber-600">PF</p>
          <p className="text-2xl font-bold text-amber-900">
            {character.combat_stats?.current_hp}/{character.combat_stats?.max_hp}
          </p>
        </AncientCardContainer>
        <AncientCardContainer className="p-4 text-center" size='sm'>
          <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-amber-600">CA</p>
          <p className="text-2xl font-bold text-amber-900">
            {character.combat_stats?.armor_class}
          </p>
        </AncientCardContainer>
        <AncientCardContainer className="p-4 text-center" size='sm'>
          <Footprints className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-amber-600">Velocità</p>
          <p className="text-2xl font-bold text-amber-900">
            {character.combat_stats?.speed} ft
          </p>
        </AncientCardContainer>
        <AncientCardContainer className="p-4 text-center" size='sm'>
          <InitiativeIcon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xs text-amber-600">Iniziativa</p>
          <p className="text-2xl font-bold text-amber-900">
            {initiative > 0 ? `+${initiative}` : `${initiative}`}
          </p>
        </AncientCardContainer>
      </div>

      {/* Griglia a 2 colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caratteristiche */}
        <AncientCardContainer className="p-6">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4 text-center border-b border-amber-200 pb-2">
            Caratteristiche
          </h2>
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
        </AncientCardContainer>

        {/* Info Personaggio */}
        <AncientCardContainer className="p-6">
          <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4 text-center border-b border-amber-200 pb-2">
            Info Personaggio
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
              <span className="text-amber-800">Background</span>
              <span className="font-bold text-amber-900">{character.background || 'Nessuno'}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
              <span className="text-amber-800">Allineamento</span>
              <span className="font-bold text-amber-900">{character.alignment || 'Neutrale'}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
              <span className="text-amber-800">Bonus Competenza</span>
              <span className="font-bold text-amber-900 text-xl">+{proficiencyBonus}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
              <span className="text-amber-800">Tiri Salvezza</span>
              <span className="font-bold text-amber-900">
                {character.classes?.saving_throws?.map((s: string) => s.slice(0, 3).toUpperCase()).join(' · ')}
              </span>
            </div>
          </div>
        </AncientCardContainer>
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
            <Spellbook characterId={characterId} />
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="inventory">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Inventario  
            </h3>
            <InventoryGrouped items={inventory?.items} />
            </AncientCardContainer>
        
        </TabsContent>
      </Tabs>
    </div>
  )
}