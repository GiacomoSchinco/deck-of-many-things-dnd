// components/character/creation-wizard/hooks/useCharacterCreation.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateCharacter } from '@/hooks/mutations/useCharacterMutations';
import { useCharacterCalculations } from '@/hooks/useCharacterCalculations';
import { useCreationStore } from '@/store/useCreationStore';
import type { EquipmentItem } from '@/types/equipment';

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
  // Optional equipment selected during creation
  equipment?: EquipmentItem[];
}

export type CreationStep = 
  | 'basic-info'
  | 'race'
  | 'class'
  | 'campaign'
  | 'abilities'
  | 'equipment'
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

  const steps: CreationStep[] = ['basic-info', 'race', 'class', 'campaign', 'abilities', 'equipment','review'];
  
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
          // If equipment was selected during creation, save inventory server-side
          (async () => {
            try {
              if (data.equipment && data.equipment.length > 0) {
                const itemsDetails = await Promise.all(
                  data.equipment.map(async (item) => {
                    const res = await fetch(`/api/items/${item.item_id}`);
                    if (!res.ok) throw new Error('Errore caricamento item');
                    const fullItem = await res.json();
                    return {
                      character_id: character.id,
                      item_id: item.item_id,
                      item_name: item.name || fullItem.name,
                      item_type: fullItem.type,
                      quantity: item.quantity,
                      weight: fullItem.weight,
                      equipped: fullItem.type === 'weapon' || fullItem.type === 'armor',
                      properties: fullItem.properties ?? null,
                    };
                  })
                );

                  // Posta gli oggetti all'endpoint inventory server-side
                  try {
                    const res = await fetch(`/api/characters/${character.id}/inventory`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ items: itemsDetails })
                    });

                    if (!res.ok) {
                      const err = await res.json().catch(() => ({ error: 'Unknown' }));
                      console.error('Errore salvataggio inventario (API):', err);
                    } else {
                      const payload = await res.json().catch(() => null);
                      console.log(`✅ Inventario salvato: ${payload?.inserted ?? 0} oggetti`);
                    }
                  } catch (e) {
                    console.error('Errore salvataggio inventario (fetch):', e);
                  }
              }
            } catch (e) {
              console.error(e);
              toast.error('Errore salvataggio inventario');
            } finally {
              reset();
              router.push(`/dashboard/${character.id}`);
            }
          })();
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