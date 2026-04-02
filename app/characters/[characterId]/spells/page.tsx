// app/characters/[characterId]/spells/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Spellbook from '@/components/character/sheet/Spellbook';
import PreparedSpellsManager from '@/components/character/sheet/PreparedSpellsManager';
import { useCharacter } from '@/hooks/queries/useCharacter';
import { getEnglishClass } from '@/lib/utils/nameMappers';
import Loading from '@/components/custom/Loading';
import AncientCardContainer from '@/components/custom/AncientCardContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SpellPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  const { data: character, isLoading, refetch } = useCharacter(characterId);
  const [refreshKey, setRefreshKey] = useState(0);

  const englishClass = getEnglishClass(character?.classes?.name ?? '');
  const isPreparerClass = ['cleric', 'druid', 'paladin', 'wizard'].includes(englishClass);
  const isWizard = englishClass === 'wizard';

  // Calcola il modificatore appropriato
  const getAbilityModifier = () => {
    if (!character?.ability_scores) return 0;
    if (isWizard) {
      return Math.floor((character.ability_scores.intelligence - 10) / 2);
    }
    if (englishClass === 'paladin') {
      return Math.floor((character.ability_scores.charisma - 10) / 2);
    }
    // cleric, druid
    return Math.floor((character.ability_scores.wisdom - 10) / 2);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-serif font-bold text-amber-900">Magie</h1>
        <p className="text-amber-700 mt-1">
          Gestisci le magie conosciute e preparate del tuo personaggio.
        </p>
      </div>

      <Tabs defaultValue="known" className="space-y-4">
        <TabsList className="bg-amber-100/50 border border-amber-200">
          <TabsTrigger value="known">📖 Incantesimi Conosciuti</TabsTrigger>
          {isPreparerClass && (
            <TabsTrigger value="prepared">✨ Incantesimi Preparati</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="known">
          <AncientCardContainer className="p-6">
            <Spellbook
              key={refreshKey}
              characterId={characterId}
              classId={character?.class_id}
              characterLevel={character?.level}
              intelligenceScore={character?.ability_scores?.intelligence}
              isPreparer={isPreparerClass}
              onSpellsChange={() => setRefreshKey(prev => prev + 1)}
            />
          </AncientCardContainer>
        </TabsContent>

        {isPreparerClass && (
          <TabsContent value="prepared">
            <AncientCardContainer className="p-6">
              <PreparedSpellsManager
                characterId={characterId}
                className={englishClass}
                characterLevel={character?.level ?? 1}
                abilityModifier={getAbilityModifier()}
                isWizard={isWizard}
                onRefresh={() => refetch()}
              />
            </AncientCardContainer>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}