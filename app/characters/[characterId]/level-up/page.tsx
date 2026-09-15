// app/characters/[characterId]/level-up/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import LevelUpWizard from '@/components/character/level-up';
import { useCharacter } from '@/hooks/queries/useCharacter';
import Loading from '@/components/custom/Loading';

export default function LevelUpPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const { data: character, isLoading } = useCharacter(characterId);

  if (isLoading) return <Loading />;
  if (!character) return <div>Personaggio non trovato</div>;

  return (
    <LevelUpWizard
      characterId={characterId}
      currentLevel={character.level}
      onComplete={() => router.push(`/characters/${characterId}`)}
    />
  );
}