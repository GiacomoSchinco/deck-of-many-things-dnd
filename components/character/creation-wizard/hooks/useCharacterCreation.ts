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

  // 🔁 Passa anche il livello ai calcoli
  const calculations = useCharacterCalculations(
    data.raceId ?? null,
    data.classId ?? null,
    data.abilityScores ?? null,
    data.level ?? 1,   // ← aggiunto
  );

  const steps: CreationStep[] = (() => {
    const base: CreationStep[] = ['basic-info', 'race', 'class', 'campaign', 'abilities', 'skills', 'equipment', 'spells', 'review'];
    const classData = calculations.calculations?.classData;

    // Feature flag: NEXT_PUBLIC_SKIP_SPELLS_STEP=true will skip the spells step entirely
    const skipSpellsFlag = (process.env.NEXT_PUBLIC_SKIP_SPELLS_STEP === '1' || process.env.NEXT_PUBLIC_SKIP_SPELLS_STEP === 'true');
    if (skipSpellsFlag) return base.filter(s => s !== 'spells');

    // If classData is available and class has no spellcasting, remove the spells step
    if (classData && !classData.spellcasting) {
      return base.filter(s => s !== 'spells');
    }
    return base;
  })();
  
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
        level: data.level ?? 1,               // ← usa il livello scelto
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

            // 4) Save spells selected in SpellsStep
            if (data.spells && data.spells.length > 0) {
              try {
                const spellIds = data.spells.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
                if (spellIds.length > 0) {
                  const res = await fetch(`/api/characters/${character.id}/spells`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spell_ids: spellIds }),
                  });
                  if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Errore salvataggio incantesimi');
                  }
                  const payload = await res.json();
                  console.log(`✅ Incantesimi salvati: ${payload.inserted ?? 0}`);
                }
              } catch (e) {
                console.error('Errore salvataggio incantesimi:', e);
              }
            }

            // 5) Initialize spell_slots from spellcasting progression using the actual character level
            const spellcastingAbility = calculations.calculations?.classData?.spellcasting?.spellcasting_ability;
            const characterLevel = data.level ?? 1;
            if (spellcastingAbility && calculations.calculations?.classData) {
              try {
                const englishClass = calculations.calculations.classData.name?.toLowerCase();
                // Usa il livello effettivo del personaggio
                const progressionRes = await fetch(
                  `/api/spellcasting-progression?class=${englishClass}&level=${characterLevel}`
                );
                if (progressionRes.ok) {
                  const progression = await progressionRes.json();
                  const slots: Record<string, number> = progression?.spell_slots ?? {};
                  const pactSlots: number = progression?.pact_slots ?? 0;
                  const pactLevel: string | null = progression?.pact_slot_level ?? null;

                  const rows: { character_id: string; spell_level: number; total_slots: number; used_slots: number }[] = [];

                  const levelMap: Record<string, number> = {
                    '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5,
                    '6th': 6, '7th': 7, '8th': 8, '9th': 9,
                  };
                  for (const [key, count] of Object.entries(slots)) {
                    const lvl = levelMap[key];
                    if (lvl && (count as number) > 0) {
                      rows.push({ character_id: character.id, spell_level: lvl, total_slots: count as number, used_slots: 0 });
                    }
                  }

                  if (pactSlots > 0 && pactLevel) {
                    const pactLvl = levelMap[pactLevel];
                    if (pactLvl) {
                      rows.push({ character_id: character.id, spell_level: pactLvl, total_slots: pactSlots, used_slots: 0 });
                    }
                  }

                  if (rows.length > 0) {
                    const slotsRes = await fetch(`/api/characters/${character.id}/spell-slots`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ slots: rows }),
                    });
                    if (!slotsRes.ok) {
                      console.error('Errore inizializzazione spell slots');
                    } else {
                      console.log(`✅ Spell slots inizializzati per livello ${characterLevel}`);
                    }
                  }
                }
              } catch (e) {
                console.error('Errore inizializzazione spell slots:', e);
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