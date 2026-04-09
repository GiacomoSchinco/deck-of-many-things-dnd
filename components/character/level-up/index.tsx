// components/character/level-up/index.tsx
'use client';

import { useRouter } from 'next/navigation';
import Loading from '@/components/custom/Loading';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLevelUp } from './hooks/useLevelUp';

interface LevelUpWizardProps {
  characterId: string;
  currentLevel: number;
  onComplete: () => void;
}

export default function LevelUpWizard({ characterId, currentLevel, onComplete }: LevelUpWizardProps) {
  const router = useRouter();
  const {
    character,
    isLoading,
    changes,
    steps,
    step,
    currentStep,
    progress,
    levelUpData,
    isSaving,
    handleNext,
    handleBack,
  } = useLevelUp({ characterId, currentLevel, onComplete });

  if (isLoading || !changes || !currentStep) return <Loading />;

  const newLevel = currentLevel + 1;

  const CurrentComponent = currentStep.component;

  return (
    <PageWrapper
      withContainer={false}
      title={`Level Up: ${character?.name ?? ''}`}
      subtitle={`Da livello ${currentLevel} a livello ${newLevel}`}
      variant='minimal'
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
        {/* Progress bar */}
        <div className="h-2 bg-amber-200 rounded-full">
          <div
            className="h-full bg-amber-700 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step corrente */}
        <CurrentComponent
          character={character}
          currentLevel={currentLevel}
          newLevel={newLevel}
          changes={changes}
          data={levelUpData}
          onNext={handleNext}
          onBack={handleBack}
          isLast={step === steps.length - 1}
          isSaving={isSaving}
        />
      </div>
    </PageWrapper>
  );
}
