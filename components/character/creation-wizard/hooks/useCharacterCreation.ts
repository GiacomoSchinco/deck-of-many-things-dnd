// components/character/creation-wizard/hooks/useCharacterCreation.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateCharacter, useDeleteCharacter } from '@/hooks/mutations/useCharacterMutations';
import { useSkillMutations } from '@/hooks/mutations/useSkillMutations';
import { useCharacterCalculations } from '@/hooks/useCharacterCalculations';
import { useInventoryMutations } from '@/hooks/mutations/useInventoryMutations';
import { useApplySavingThrows } from '@/hooks/mutations/useSavingThrowMutations';
import { useAddCharacterSpells, useInitSpellSlots } from '@/hooks/mutations/useCharacterSpellMutations';
import { useCreationStore } from '@/store/useCreationStore';
import type { CreationStep } from '@/types/creation';
import { getSpellProgression } from '@/lib/rules/spellcasting';
import type { SpellCastingClass } from '@/lib/rules/spellcasting';
import { getEnglishClass } from '@/lib/utils/nameMappers';

// Ordine canonico degli step del wizard
const BASE_STEPS: CreationStep[] = [
  'basic-info', 'race', 'class', 'campaign',
  'abilities', 'skills', 'equipment', 'spells', 'review',
];

export function useCharacterCreation() {
  const router = useRouter();

  // Controlla l'intero flusso di salvataggio (creazione + post-steps).
  // Usato per bloccare il wizard con un overlay di loading finché non si
  // naviga alla pagina del personaggio o si torna in stato di errore.
  const [isSaving, setIsSaving] = useState(false);

  // ─── Mutations ────────────────────────────────────────────────────────────
  const createCharacter    = useCreateCharacter();
  const deleteCharacter    = useDeleteCharacter();
  const skillMutations     = useSkillMutations();
  const inventoryMutations = useInventoryMutations();
  const addSpells          = useAddCharacterSpells();
  const initSpellSlots     = useInitSpellSlots();
  const applySavingThrows  = useApplySavingThrows();

  // ─── Store & calcoli derivati ─────────────────────────────────────────────
  const { currentStep, data, setStep, updateData, reset, _hasHydrated } = useCreationStore();

  const calculations = useCharacterCalculations(
    data.raceId   ?? null,
    data.classId  ?? null,
    data.abilityScores ?? null,
    data.level    ?? 1,
  );

  // ─── Step attivi ──────────────────────────────────────────────────────────
  // Rimuove lo step 'spells' se la classe non ha spellcasting o se il flag è attivo
  const steps: CreationStep[] = (() => {
    const { classData } = calculations.calculations ?? {};
    const skipFlag = process.env.NEXT_PUBLIC_SKIP_SPELLS_STEP === '1'
                  || process.env.NEXT_PUBLIC_SKIP_SPELLS_STEP === 'true';
    if (skipFlag || (classData && !classData.spellcasting))
      return BASE_STEPS.filter(s => s !== 'spells');
    return BASE_STEPS;
  })();

  // ─── Navigazione wizard ───────────────────────────────────────────────────
  const idx      = steps.indexOf(currentStep);
  const nextStep = () => idx < steps.length - 1 && setStep(steps[idx + 1]);
  const prevStep = () => idx > 0                 && setStep(steps[idx - 1]);

  // ─── Salvataggio dati aggiuntivi ──────────────────────────────────────────
  /**
   * Salva in sequenza ciò che non fa parte del record principale:
   * skill, inventario, tiri salvezza, incantesimi, spell slot iniziali.
   * Se una qualsiasi sotto-operazione fallisce, lancia un'eccezione così che
   * il chiamante possa gestire il rollback (eliminazione del personaggio).
   */
  const savePostCreationData = async (characterId: string) => {
    const { classData } = calculations.calculations ?? {};

    // 1) Skill di competenza scelte dal giocatore
    if (data.skills?.length) {
      await skillMutations.create.mutateAsync({
        characterId,
        skills: data.skills.map(id => ({ skill_id: parseInt(id, 10), proficiency_type: 'proficient' as const })),
      });
    }

    // 2) Equipaggiamento iniziale
    if (data.equipment?.length) {
      const items = data.equipment
        .map(item => ({ item_id: item.item_id, quantity: Math.max(1, item.quantity) }))
        .filter(i => i.item_id > 0);

      if (items.length) await inventoryMutations.create.mutateAsync({ characterId, items });
    }

    // 3) Tiri salvezza garantiti dalla classe
    if (classData?.saving_throws?.length) {
      await applySavingThrows.mutateAsync({
        characterId,
        savingThrows: classData.saving_throws.map((ability: string) => ({ ability, proficient: true })),
      });
    }

    // 4) Incantesimi noti scelti nel wizard
    if (data.spells?.length) {
      const spellIds = data.spells.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      if (spellIds.length) await addSpells.mutateAsync({ characterId, spellIds });
    }

    // 5) Spell slot iniziali (da regole locali, senza DB)
    if (classData?.spellcasting) {
      const englishClass = getEnglishClass(classData.name) as SpellCastingClass;
      const spellAbility = classData.spellcasting.spellcasting_ability as 'intelligence' | 'wisdom' | 'charisma';
      const score = data.abilityScores?.[spellAbility] ?? 10;
      const abilityMod = Math.floor((score - 10) / 2);
      const prog = getSpellProgression(englishClass, data.level ?? 1, abilityMod);

      const slots = Object.entries(prog.spellSlots)
        .map(([lvl, n]) => ({ spell_level: Number(lvl), total_slots: n, used_slots: 0 }))
        .filter(s => s.total_slots > 0);

      // Warlock: pact magic
      if (prog.pactMagic && prog.pactMagic.slots > 0) {
        slots.push({ spell_level: prog.pactMagic.level, total_slots: prog.pactMagic.slots, used_slots: 0 });
      }

      if (slots.length) await initSpellSlots.mutateAsync({ characterId, slots });
    }
  };

  // ─── Salvataggio personaggio ──────────────────────────────────────────────
  /**
   * Flusso:
   *  1. Imposta isSaving = true → il wizard mostra il loading overlay
   *  2. Crea il personaggio principale
   *  3. Salva i dati collegati (skill, inventario, ecc.)
   *  4. Successo  → reset store + naviga alla scheda personaggio
   *  5. Qualsiasi errore → elimina il personaggio se è stato creato (rollback),
   *     mostra il toast di errore, NON resetta lo store (l'utente può correggere
   *     e riprovare senza reinserire tutto)
   */
  const saveCharacter = async () => {
    if (!data.name || !data.raceId || !data.classId || !data.abilityScores) {
      toast.error('Dati incompleti'); return;
    }
    if (!calculations.calculations) {
      toast.error('Calcoli non pronti, riprova tra un momento'); return;
    }

    // Applica i bonus razziali alle statistiche base
    const bonuses: Record<string, number> = calculations.calculations.raceData?.ability_bonuses ?? {};
    const base = data.abilityScores;
    const withBonuses = {
      strength:     base.strength     + (bonuses.strength     ?? 0),
      dexterity:    base.dexterity    + (bonuses.dexterity    ?? 0),
      constitution: base.constitution + (bonuses.constitution ?? 0),
      intelligence: base.intelligence + (bonuses.intelligence ?? 0),
      wisdom:       base.wisdom       + (bonuses.wisdom       ?? 0),
      charisma:     base.charisma     + (bonuses.charisma     ?? 0),
    };

    setIsSaving(true);
    let createdId: string | null = null;

    try {
      const character = await createCharacter.mutateAsync({
        name:          data.name,
        playerName:    data.playerName  || undefined,
        campaignId:    data.campaignId  || undefined,
        raceId:        String(data.raceId),
        classId:       String(data.classId),
        level:         data.level ?? 1,
        experience:    0,
        background:    data.background  || undefined,
        alignment:     data.alignment   || undefined,
        abilityScores: withBonuses,
        combatStats:   calculations.calculations.combatStats,
      });

      createdId = character.id;
      await savePostCreationData(character.id);

      // Tutto ok: reset store e naviga
      reset();
      router.push(`/characters/${character.id}`);

    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Errore durante il salvataggio';
      toast.error(msg);

      // Rollback: elimina il personaggio se era già stato creato sul server
      if (createdId) {
        await deleteCharacter.mutateAsync(createdId).catch(() => {});
      }

      // NON resettiamo lo store: i dati dell'utente rimangono intatti per un nuovo tentativo
      setIsSaving(false);
    }
  };

  return {
    currentStep,
    data,
    loading:      isSaving,
    updateData,
    nextStep,
    prevStep,
    saveCharacter,
    calculations,
    isFirstStep:  currentStep === 'basic-info',
    isLastStep:   currentStep === 'review',
    isHydrated:   _hasHydrated,
  };
}