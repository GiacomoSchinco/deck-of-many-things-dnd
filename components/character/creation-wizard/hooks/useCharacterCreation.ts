// components/character/creation-wizard/hooks/useCharacterCreation.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

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
  
  const [loading, setLoading] = useState(false);
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

  // Salvataggio su Supabase
  const saveCharacter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validazione
      if (!data.name || !data.raceId || !data.classId || !data.abilityScores) {
        throw new Error('Dati incompleti');
      }

      // 1. Ottieni l'utente corrente
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Devi essere loggato per creare un personaggio');
      }

      // 2. Inserisci il personaggio
      const { data: character, error: charError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: data.name,
          player_name: data.playerName || null,
          campaign_id: data.campaignId || null,
          race_id: data.raceId,
          class_id: data.classId,
          level: 1,
          experience: 0,
          background: data.background,
          alignment: data.alignment,
        })
        .select()
        .single();

      if (charError) throw charError;

      // 3. Inserisci i punteggi di caratteristica
      const { error: scoresError } = await supabase
        .from('ability_scores')
        .insert({
          character_id: character.id,
          strength: data.abilityScores.strength,
          dexterity: data.abilityScores.dexterity,
          constitution: data.abilityScores.constitution,
          intelligence: data.abilityScores.intelligence,
          wisdom: data.abilityScores.wisdom,
          charisma: data.abilityScores.charisma,
        });

      if (scoresError) throw scoresError;

      // 4. Crea le combat_stats di base
      const { error: combatError } = await supabase
        .from('combat_stats')
        .insert({
          character_id: character.id,
          max_hp: 10, // Da calcolare in base a classe e COS
          current_hp: 10,
          temp_hp: 0,
          hit_dice_type: 'd10', // Da prendere dalla classe
          hit_dice_total: 1,
          hit_dice_used: 0,
          armor_class: 10, // Da calcolare
          initiative_bonus: 0,
          speed: 30, // Da prendere dalla razza
          inspiration: false,
        });

      if (combatError) throw combatError;

      // 5. Reindirizza alla pagina del personaggio
      router.push(`/characters/${character.id}`);
      
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Errore durante il salvataggio';
      setError(message);
      console.error('Errore salvataggio:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    data,
    loading,
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