// components/character/creation-wizard/hooks/useCharacterCreation.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateCharacter } from '@/hooks/mutations/useCharacterMutations';
import { useSkillMutations } from '@/hooks/mutations/useSkillMutations';
import { useCharacterCalculations } from '@/hooks/useCharacterCalculations';
import { useInventoryMutations } from '@/hooks/mutations/useInventoryMutations';
import { useCreationStore } from '@/store/useCreationStore';
import type { CreationStep } from '@/types/creation';

export function useCharacterCreation() {
  const router = useRouter();
  const createCharacter = useCreateCharacter();
  const skillMutations = useSkillMutations();
  const inventoryMutations = useInventoryMutations();

  const { currentStep, data, setStep, updateData, reset, _hasHydrated } = useCreationStore();

  const calculations = useCharacterCalculations(
    data.raceId ?? null,
    data.classId ?? null,
    data.abilityScores ?? null,
  );

  const steps: CreationStep[] = ['basic-info', 'race', 'class', 'campaign', 'abilities', 'skills', 'equipment', 'review'];
  
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
        onSuccess: async (character) => {
          toast.success('Personaggio creato!');

          try {
            // 1) Save selected skills (if any) using mutations
            if (data.skills && data.skills.length > 0) {
              const skillsToInsert = data.skills.map((skillId) => ({
                skill_id: parseInt(skillId, 10),
                proficiency_type: 'proficient' as const,
              }));

              try {
                await skillMutations.create.mutateAsync({ characterId: character.id, skills: skillsToInsert });
              } catch (e) {
                console.error('Errore salvataggio skill (mutation):', e);
              }
            }

            // 2) If equipment was selected during creation, save inventory server-side
            // Il server legge tutti i dati (name, description, properties, type, weight) dal catalogo items
            if (data.equipment && data.equipment.length > 0) {
              const itemsDetails = data.equipment
                .map((item) => {
                  const itemObj = item as Record<string, unknown>;
                  const rawId = itemObj['item_id'];
                  const itemId: number | null = typeof rawId === 'string'
                    ? (rawId.trim() === '' ? null : parseInt(rawId, 10))
                    : (typeof rawId === 'number' ? rawId : null);
                  const qty = Math.max(1, Math.trunc(Number(itemObj['quantity'] ?? 1) || 1));
                  return itemId !== null ? { item_id: itemId, quantity: qty } : null;
                })
                .filter((i): i is { item_id: number; quantity: number } => i !== null);

              try {
                const payload = await inventoryMutations.create.mutateAsync({ characterId: character.id, items: itemsDetails });
                console.log(`✅ Inventario salvato: ${payload?.inserted ?? 0} oggetti`);
              } catch (e) {
                console.error('Errore salvataggio inventario (mutation):', e);
              }
            }

            // 3) Save class saving throws
            const savingThrows = calculations.calculations?.classData?.saving_throws;
            if (savingThrows && savingThrows.length > 0) {
              try {
                const res = await fetch(`/api/characters/${character.id}/saving-throws`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    saving_throws: savingThrows.map((ability: string) => ({
                      ability,
                      proficient: true,
                    })),
                  }),
                });
                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err.error || 'Errore salvataggio tiri salvezza');
                }
                console.log(`✅ Tiri salvezza salvati: ${savingThrows.join(', ')}`);
              } catch (e) {
                console.error('Errore salvataggio tiri salvezza:', e);
              }
            }
          } catch (e) {
            console.error(e);
            toast.error('Errore durante il salvataggio aggiuntivo');
          } finally {
            reset();
            router.push(`/characters/${character.id}`);
          }
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