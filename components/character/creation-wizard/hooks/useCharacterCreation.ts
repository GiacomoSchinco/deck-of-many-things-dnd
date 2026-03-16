// components/character/creation-wizard/hooks/useCharacterCreation.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateCharacter } from '@/hooks/mutations/useCharacterMutations';

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
  
  const [currentStep, setCurrentStep] = useState<CreationStep>('basic-info');
  const [data, setData] = useState<Partial<CreationData>>({
    name: '',
    playerName: '',
    alignment: 'Neutrale',
    background: '',
    raceId: null,
    classId: null,
    campaignId: null,
    abilityScores: null,
  });
  
  const [error, setError] = useState<string | null>(null);

  const updateData = (newData: Partial<CreationData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const steps: CreationStep[] = ['basic-info', 'race', 'class', 'campaign', 'abilities', 'review'];
  
  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const goToStep = (step: CreationStep) => {
    setCurrentStep(step);
  };

  // Salvataggio tramite mutation API
  const saveCharacter = async () => {
    setError(null);

    if (!data.name || !data.raceId || !data.classId || !data.abilityScores) {
      setError('Dati incompleti');
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
        abilityScores: data.abilityScores,
      },
      {
        onSuccess: (character) => {
          router.push(`/dashboard/${character.id}`);
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
        },
      }
    );
  };

  return {
    currentStep,
    data,
    loading: createCharacter.isPending,
    error,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    saveCharacter,
    isFirstStep: currentStep === 'basic-info',
    isLastStep: currentStep === 'review',
  };
}