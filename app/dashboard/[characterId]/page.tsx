// app/characters/[characterId]/page.tsx
"use client"

import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AncientCardContainer from '@/components/ui/custom/AncientCardContainer'
import StatDiamond from '@/components/ui/custom/StatDiamond'
import { Button } from '@/components/ui/button'
import { Scroll, Package, Zap } from 'lucide-react'
import Link from 'next/link'
import { useCharacter } from '@/hooks/queries/useCharacter'
import Loading from '@/components/ui/custom/Loading'

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header con nome e azioni rapide */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-bold text-amber-900">
            {character.name}
          </h1>
          <p className="text-amber-700">
            {character.races?.name} · {character.classes?.name} · Livello {character.level}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Link href={`/characters/${characterId}/spells`}>
              <Scroll className="w-4 h-4 mr-2" />
              Incantesimi
            </Link>
          </Button>
          <Button variant="outline">
            <Link href={`/characters/${characterId}/inventory`}>
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </Link>
          </Button>
          <Button variant="outline">
            <Link href={`/characters/${characterId}/level-up`}>
              <Zap className="w-4 h-4 mr-2" />
              Level Up
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AncientCardContainer className="p-4 text-center">
          <p className="text-sm text-amber-600">PF</p>
          <p className="text-3xl font-bold text-amber-900">
            {character.combat_stats?.current_hp}/{character.combat_stats?.max_hp}
          </p>
        </AncientCardContainer>

        <AncientCardContainer className="p-4 text-center">
          <p className="text-sm text-amber-600">CA</p>
          <p className="text-3xl font-bold text-amber-900">
            {character.combat_stats?.armor_class}
          </p>
        </AncientCardContainer>

        <AncientCardContainer className="p-4 text-center">
          <p className="text-sm text-amber-600">Velocità</p>
          <p className="text-3xl font-bold text-amber-900">
            {character.combat_stats?.speed} ft
          </p>
        </AncientCardContainer>

        <AncientCardContainer className="p-4 text-center">
          <p className="text-sm text-amber-600">Iniziativa</p>
          <p className="text-3xl font-bold text-amber-900">
            +{character.combat_stats?.initiative_bonus}
          </p>
        </AncientCardContainer>
      </div>

      {/* Sezione caratteristiche */}
      <AncientCardContainer className="p-6">
        <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">
          Caratteristiche
        </h2>
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
  {[
    { label: 'FOR', statKey: 'strength' },
    { label: 'DES', statKey: 'dexterity' },
    { label: 'COS', statKey: 'constitution' },
    { label: 'INT', statKey: 'intelligence' },
    { label: 'SAG', statKey: 'wisdom' },
    { label: 'CAR', statKey: 'charisma' },
  ].map(({ label, statKey }) => (
    <StatDiamond
      key={statKey}
      label={label}
      statKey={statKey}
      value={character.ability_scores?.[statKey as keyof typeof character.ability_scores]}
      modifier={0}
    />
  ))}
</div>
      </AncientCardContainer>

      {/* Tabs per le varie sezioni */}
      <Tabs defaultValue="combat" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="combat">Combattimento</TabsTrigger>
          <TabsTrigger value="skills">Abilità</TabsTrigger>
          <TabsTrigger value="spells">Incantesimi</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="combat">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Statistiche di Combattimento
            </h3>
            <p className="text-amber-700">TODO: Tabella attacchi, tiri salvezza, ecc.</p>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="skills">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Abilità e Competenze
            </h3>
            <p className="text-amber-700">TODO: Lista abilità con bonus</p>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="spells">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Incantesimi
            </h3>
            <Button className="mb-4">
              <Link href={`/characters/${characterId}/spells`}>
                Gestisci Incantesimi
              </Link>
            </Button>
            <p className="text-amber-700">TODO: Lista incantesimi conosciuti</p>
          </AncientCardContainer>
        </TabsContent>

        <TabsContent value="inventory">
          <AncientCardContainer className="p-6">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4">
              Inventario
            </h3>
            <Button className="mb-4">
              <Link href={`/characters/${characterId}/inventory`}>
                Gestisci Inventario
              </Link>
            </Button>
            <p className="text-amber-700">TODO: Lista oggetti</p>
          </AncientCardContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}