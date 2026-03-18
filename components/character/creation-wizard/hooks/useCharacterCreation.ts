// components/character/creation-wizard/hooks/useCharacterCreation.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateCharacter } from '@/hooks/mutations/useCharacterMutations';
import { useCharacterCalculations } from '@/hooks/useCharacterCalculations';
import { useCreationStore } from '@/store/useCreationStore';

export interface CreationData {
  // Step 1 - Basic Info
  name: string;
  playerName: string;
  alignment: string;
  background: string;
  
  // Step 2 - Race
  raceId: number | null;
  
  // Step 3 - Class
  classId: number | null;

  // Step 4 - Campaign
  campaignId: string | null;  // UUID della campagna

  // Step 5 - Ability Scores
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  } | null;
}

export type CreationStep = 
  | 'basic-info'
  | 'race'
  | 'class'
  | 'campaign'
  | 'abilities'
  | 'review';

export function useCharacterCreation() {
  const router = useRouter();
  const createCharacter = useCreateCharacter();

  const { currentStep, data, setStep, updateData, reset, _hasHydrated } = useCreationStore();

  const calculations = useCharacterCalculations(
    data.raceId ?? null,
    data.classId ?? null,
    data.abilityScores ?? null,
  );

  const steps: CreationStep[] = ['basic-info', 'race', 'class', 'campaign', 'abilities', 'review'];
  
  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const goToStep = (step: CreationStep) => {
    setStep(step);
  };

  const saveCharacter = async () => {
    if (!data.name || !data.raceId || !data.classId || !data.abilityScores) {
      toast.error('Dati incompleti');
      return;
    }

    if (!calculations.calculations) {
      toast.error('Calcoli non pronti, riprova tra un momento');
      return;
    }

    createCharacter.mutate(
      {
        name: data.name,
        playerName: data.playerName || undefined,
        campaignId: data.campaignId || undefined,
        raceId: String(data.raceId),
        classId: String(data.classId),
        level: 1,
        experience: 0,
        background: data.background || undefined,
        alignment: data.alignment || undefined,
        abilityScores: (() => {
          const bonuses: Record<string, number> = calculations.calculations.raceData?.ability_bonuses || {};
          const base = data.abilityScores!;
          return {
            strength:     base.strength     + (bonuses['strength']     || 0),
            dexterity:    base.dexterity    + (bonuses['dexterity']    || 0),
            constitution: base.constitution + (bonuses['constitution'] || 0),
            intelligence: base.intelligence + (bonuses['intelligence'] || 0),
            wisdom:       base.wisdom       + (bonuses['wisdom']       || 0),
            charisma:     base.charisma     + (bonuses['charisma']     || 0),
          };
        })(),
        combatStats: calculations.calculations.combatStats,
      },
      {
        onSuccess: (character) => {
          toast.success('Personaggio creato!');
          reset();
          router.push(`/dashboard/${character.id}`);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Errore durante il salvataggio');
        },
      }
    );
  };

  return {
    currentStep,
    data,
    loading: createCharacter.isPending,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    saveCharacter,
    calculations,
    isFirstStep: currentStep === 'basic-info',
    isLastStep: currentStep === 'review',
    isHydrated: _hasHydrated,
  };
}