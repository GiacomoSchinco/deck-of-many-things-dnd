// app/characters/[characterId]/page.tsx
"use client"

import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AncientCardContainer from '@/components/custom/AncientCardContainer'
import StatDiamond from '@/components/custom/StatDiamond'
import { Button } from '@/components/ui/button'
import { Scroll, Package, Zap, Heart, Shield, Footprints, Zap as InitiativeIcon } from 'lucide-react'
import Link from 'next/link'
import { useCharacter } from '@/hooks/queries/useCharacter'
import Loading from '@/components/custom/Loading'
import { PageWrapper } from '@/components/layout/PageWrapper'

export default function CharacterPage() {
  const params = useParams()
  const characterId = params.characterId as string
  
  const { data: character, isLoading, error } = useCharacter(characterId)

  if (isLoading) {
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

  return (
    <PageWrapper
      withContainer={false}
      title={character.name}
      subtitle={`${character.races?.name ?? ''} · ${character.classes?.name ?? ''} · Livello ${character.level}`}
      action={
        <div className="flex gap-2">
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
      {/* Combat Stats in alto */}
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

      {/* Griglia a 2 colonne: caratteristiche + info base */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonna sinistra - Caratteristiche */}
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
                value={character.ability_scores?.[key as keyof typeof character.ability_scores]}
                modifier={0}
              />
            ))}
          </div>
        </AncientCardContainer>

        {/* Colonna destra - Info rapide */}
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
                {character.classes?.saving_throws?.map((s: string) => s.slice(0,3).toUpperCase()).join(' · ')}
              </span>
            </div>
          </div>
        </AncientCardContainer>
      </div>

      {/* Tabs per dettagli */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-4 border-b border-amber-200">
          <TabsTrigger className="w-full text-center" value="skills">Abilità</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="spells">Incantesimi</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Abilità
            </h3>
            <p className="text-amber-700 text-center py-8">Prossimamente...</p>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="spells">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Incantesimi
            </h3>
            <div className="flex justify-center">
              <Link href={`/characters/${characterId}/spells`}>
                <Button>Gestisci Incantesimi</Button>
              </Link>
            </div>
            <p className="text-amber-700 text-center mt-4">Prossimamente...</p>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="inventory">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Inventario
            </h3>
            <div className="flex justify-center">
              <Link href={`/characters/${characterId}/inventory`}>
                <Button>Gestisci Inventario</Button>
              </Link>
            </div>
            <p className="text-amber-700 text-center mt-4">Prossimamente...</p>
          </AncientCardContainer>
        </TabsContent>
      </Tabs>
    </div>
    </PageWrapper>
  )
}