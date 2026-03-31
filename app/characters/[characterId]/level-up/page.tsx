// app/characters/[characterId]/level-up/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCharacter } from '@/hooks/queries/useCharacter';
import Loading from '@/components/custom/Loading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AncientContainer from '@/components/custom/AncientContainer';
import LevelUpWizard from '@/components/character/level-up/steps/LevelUpWizard';

export default function LevelUpPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  
  const { data: character, isLoading } = useCharacter(characterId);
  
  if (isLoading) return <Loading />;
  if (!character) return <div>Personaggio non trovato</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-amber-600 hover:text-amber-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna al personaggio
        </Button>
      </div>

      <AncientContainer
        title={`Level Up: ${character.name}`}
        subtitle={`Da livello ${character.level} a livello ${character.level + 1}`}
        icon={Sparkles}
      >
        <LevelUpWizard
          characterId={characterId}
          currentLevel={character.level}
          onComplete={() => router.push(`/characters/${characterId}`)}
        />
      </AncientContainer>
    </div>
  );
}