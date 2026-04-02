// app/characters/[characterId]/level-up/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCharacter } from '@/hooks/queries/useCharacter';
import Loading from '@/components/custom/Loading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AncientContainer from '@/components/custom/AncientContainer';
import LevelUpWizard from '@/components/character/level-up/steps/LevelUpWizard';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function LevelUpPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;
  
  const { data: character, isLoading } = useCharacter(characterId);
  
  if (isLoading) return <Loading />;
  if (!character) return <div>Personaggio non trovato</div>;

  return (
    <PageWrapper
      withContainer={false}
      title={`Level Up: ${character.name}`}
      subtitle={`Da livello ${character.level} a livello ${character.level + 1}`}
      centerHeader
      action={
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-amber-600 hover:text-amber-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna al personaggio
        </Button>
      }
    >
      <div className="not-prose max-w-2xl mx-auto space-y-6">
        <LevelUpWizard
          characterId={characterId}
          currentLevel={character.level}
          onComplete={() => router.push(`/characters/${characterId}`)}
        />
      </div>
    </PageWrapper>
  );
}